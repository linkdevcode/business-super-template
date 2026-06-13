using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Template.Core.Features.Auth;
using Template.Core.Entities;
using Template.Infrastructure.Persistence;

namespace Template.Infrastructure.Auth;

/// <summary>Default auth identity service for JWT and refresh token rotation.</summary>
public sealed class IdentityService : IIdentityService
{
    private readonly AuthOptions _options;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ConcurrentDictionary<string, RefreshTokenRecord> _refreshTokens = new(StringComparer.Ordinal);

    /// <summary>Creates a new identity service.</summary>
    public IdentityService(IOptions<AuthOptions> options, IServiceScopeFactory serviceScopeFactory)
    {
        _options = options.Value;
        _serviceScopeFactory = serviceScopeFactory;
    }

    /// <inheritdoc />
    public Task<AuthLoginResult> LoginAsync(LoginCommand command, CancellationToken cancellationToken = default)
    {
        return LoginInternalAsync(command, cancellationToken);
    }

    /// <inheritdoc />
    public Task<AuthLoginResult> RefreshSessionAsync(
        RefreshSessionCommand command,
        CancellationToken cancellationToken = default)
    {
        EnsureCancellationNotRequested(cancellationToken);

        if (string.IsNullOrWhiteSpace(command.RefreshToken))
        {
            throw new UnauthorizedAccessException("Refresh session is missing.");
        }

        var currentTokenHash = HashToken(command.RefreshToken);
        if (!_refreshTokens.TryGetValue(currentTokenHash, out var session) || session.RevokedAt is not null)
        {
            throw new UnauthorizedAccessException("Refresh session is invalid.");
        }

        if (session.ExpiresAt <= DateTimeOffset.UtcNow)
        {
            _refreshTokens.TryRemove(currentTokenHash, out _);
            throw new UnauthorizedAccessException("Refresh session has expired.");
        }

        session.RevokedAt = DateTimeOffset.UtcNow;
        _refreshTokens[currentTokenHash] = session;

        return Task.FromResult(RotateSession(session));
    }

    /// <inheritdoc />
    public Task LogoutAsync(LogoutCommand command, CancellationToken cancellationToken = default)
    {
        EnsureCancellationNotRequested(cancellationToken);

        if (string.IsNullOrWhiteSpace(command.RefreshToken))
        {
            return Task.CompletedTask;
        }

        var currentTokenHash = HashToken(command.RefreshToken);
        if (_refreshTokens.TryGetValue(currentTokenHash, out var session))
        {
            session.RevokedAt = DateTimeOffset.UtcNow;
            _refreshTokens.TryRemove(currentTokenHash, out _);
        }

        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task<AuthUserDto?> GetCurrentUserAsync(
        GetCurrentUserQuery query,
        ClaimsPrincipal principal,
        CancellationToken cancellationToken = default)
    {
        return GetCurrentUserInternalAsync(principal, cancellationToken);
    }

    private async Task<AuthLoginResult> LoginInternalAsync(
        LoginCommand command,
        CancellationToken cancellationToken)
    {
        EnsureCancellationNotRequested(cancellationToken);

        if (!IsValidDemoAccount(command))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var businessUser = await LoadBusinessUserByEmailAsync(command.Email, cancellationToken);
        if (businessUser is null || !IsActiveUser(businessUser))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var sessionUser = await CreateSessionUserAsync(businessUser, cancellationToken);
        return CreateLoginResult(sessionUser);
    }

    private bool IsValidDemoAccount(LoginCommand command)
    {
        var email = command.Email?.Trim() ?? string.Empty;
        var password = command.Password ?? string.Empty;

        return string.Equals(email, _options.DemoAccount.Email.Trim(), StringComparison.OrdinalIgnoreCase)
            && string.Equals(password, _options.DemoAccount.Password, StringComparison.Ordinal);
    }

    private async Task<AuthUserDto?> GetCurrentUserInternalAsync(
        ClaimsPrincipal principal,
        CancellationToken cancellationToken)
    {
        EnsureCancellationNotRequested(cancellationToken);

        if (principal.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        var subject = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(subject, out var userId))
        {
            return null;
        }

        var businessUser = await LoadBusinessUserByIdAsync(userId, cancellationToken);
        if (businessUser is null || !IsActiveUser(businessUser))
        {
            return null;
        }

        return await CreateSessionUserAsync(businessUser, cancellationToken);
    }

    private AuthLoginResult CreateLoginResult(AuthUserDto user)
    {
        var accessTokenExpiresAt = DateTimeOffset.UtcNow.AddMinutes(_options.AccessTokenLifetimeMinutes);
        var refreshToken = GenerateRefreshToken();
        var refreshTokenHash = HashToken(refreshToken);

        var session = new RefreshTokenRecord
        {
            TokenHash = refreshTokenHash,
            UserId = user.Id,
            User = user,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(_options.RefreshTokenLifetimeDays)
        };

        _refreshTokens[refreshTokenHash] = session;

        return new AuthLoginResult
        {
            Session = new AuthSessionDto
            {
                AccessToken = CreateAccessToken(user, accessTokenExpiresAt),
                ExpiresAt = accessTokenExpiresAt,
                User = user
            },
            RefreshToken = refreshToken,
            RefreshTokenExpiresAt = session.ExpiresAt
        };
    }

    private AuthLoginResult RotateSession(RefreshTokenRecord session)
    {
        var accessTokenExpiresAt = DateTimeOffset.UtcNow.AddMinutes(_options.AccessTokenLifetimeMinutes);
        var refreshToken = GenerateRefreshToken();
        var refreshTokenHash = HashToken(refreshToken);

        var rotatedSession = new RefreshTokenRecord
        {
            TokenHash = refreshTokenHash,
            UserId = session.UserId,
            User = session.User,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(_options.RefreshTokenLifetimeDays)
        };

        _refreshTokens[refreshTokenHash] = rotatedSession;
        _refreshTokens.TryRemove(session.TokenHash, out _);

        return new AuthLoginResult
        {
            Session = new AuthSessionDto
            {
                AccessToken = CreateAccessToken(rotatedSession.User, accessTokenExpiresAt),
                ExpiresAt = accessTokenExpiresAt,
                User = rotatedSession.User
            },
            RefreshToken = refreshToken,
            RefreshTokenExpiresAt = rotatedSession.ExpiresAt
        };
    }

    private string CreateAccessToken(AuthUserDto user, DateTimeOffset expiresAt)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("name", user.FullName),
            new(JwtRegisteredClaimNames.UniqueName, user.FullName),
            new("status", user.Status),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };

        claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role)));
        claims.AddRange(user.Permissions.Select(permission => new Claim("permission", permission)));

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<AuthUserDto> CreateSessionUserAsync(User user, CancellationToken cancellationToken)
    {
        var roles = await LoadRoleNamesAsync(user.Id, cancellationToken);
        var permissions = await LoadPermissionKeysAsync(user.Id, cancellationToken);

        return new AuthUserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Status = user.Status,
            Roles = roles,
            Permissions = permissions
        };
    }

    private async Task<User?> LoadBusinessUserByEmailAsync(string email, CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var normalizedEmail = email.Trim();

        return await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Email == normalizedEmail, cancellationToken);
    }

    private async Task<User?> LoadBusinessUserByIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        return await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Id == userId, cancellationToken);
    }

    private async Task<IReadOnlyList<string>> LoadRoleNamesAsync(Guid userId, CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        return await dbContext.UserRoles
            .AsNoTracking()
            .Where(userRole => userRole.UserId == userId)
            .Select(userRole => userRole.Role.Name)
            .Distinct()
            .ToArrayAsync(cancellationToken);
    }

    private async Task<IReadOnlyList<string>> LoadPermissionKeysAsync(Guid userId, CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        return await (
                from userRole in dbContext.UserRoles.AsNoTracking()
                join rolePermission in dbContext.RolePermissions.AsNoTracking()
                    on userRole.RoleId equals rolePermission.RoleId
                where userRole.UserId == userId
                select rolePermission.Permission.Key)
            .Distinct()
            .ToArrayAsync(cancellationToken);
    }

    private static string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Base64UrlEncoder.Encode(bytes);
    }

    private static string HashToken(string token)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hash);
    }

    private static void EnsureCancellationNotRequested(CancellationToken cancellationToken)
    {
        if (cancellationToken.IsCancellationRequested)
        {
            cancellationToken.ThrowIfCancellationRequested();
        }
    }

    private static bool IsActiveUser(User user)
    {
        return string.Equals(user.Status, "ACTIVE", StringComparison.OrdinalIgnoreCase);
    }
}
