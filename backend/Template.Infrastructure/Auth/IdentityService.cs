using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Template.Core.Features.Auth;

namespace Template.Infrastructure.Auth;

/// <summary>Default auth identity service for JWT and refresh token rotation.</summary>
public sealed class IdentityService : IIdentityService
{
    private readonly AuthOptions _options;
    private readonly ConcurrentDictionary<string, RefreshTokenRecord> _refreshTokens = new(StringComparer.Ordinal);

    /// <summary>Creates a new identity service.</summary>
    public IdentityService(IOptions<AuthOptions> options)
    {
        _options = options.Value;
    }

    /// <inheritdoc />
    public Task<AuthLoginResult> LoginAsync(LoginCommand command, CancellationToken cancellationToken = default)
    {
        EnsureCancellationNotRequested(cancellationToken);
        var user = ValidateDemoCredentials(command);
        return Task.FromResult(CreateLoginResult(user));
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
        EnsureCancellationNotRequested(cancellationToken);

        if (principal.Identity?.IsAuthenticated != true)
        {
            return Task.FromResult<AuthUserDto?>(null);
        }

        var user = CreateUserFromPrincipal(principal);
        return Task.FromResult<AuthUserDto?>(user);
    }

    private AuthUserDto ValidateDemoCredentials(LoginCommand command)
    {
        if (!IsValidDemoAccount(command))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        return CreateDemoUser();
    }

    private bool IsValidDemoAccount(LoginCommand command)
    {
        var email = command.Email?.Trim() ?? string.Empty;
        var password = command.Password ?? string.Empty;

        return string.Equals(email, _options.DemoAccount.Email.Trim(), StringComparison.OrdinalIgnoreCase)
            && string.Equals(password, _options.DemoAccount.Password, StringComparison.Ordinal);
    }

    private AuthUserDto CreateDemoUser()
    {
        return new AuthUserDto
        {
            Id = CreateDeterministicUserId(_options.DemoAccount.Email),
            Email = _options.DemoAccount.Email.Trim(),
            FullName = _options.DemoAccount.FullName.Trim(),
            Status = _options.DemoAccount.Status.Trim(),
            Roles = _options.DemoAccount.Roles,
            Permissions = _options.DemoAccount.Permissions
        };
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

    private AuthUserDto? CreateUserFromPrincipal(ClaimsPrincipal principal)
    {
        var subject = principal.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = principal.FindFirstValue(JwtRegisteredClaimNames.Email) ?? principal.FindFirstValue(ClaimTypes.Email);
        var fullName = principal.FindFirstValue("name")
            ?? principal.FindFirstValue(JwtRegisteredClaimNames.UniqueName)
            ?? principal.FindFirstValue(ClaimTypes.Name)
            ?? string.Empty;
        var status = principal.FindFirstValue("status") ?? "ACTIVE";

        if (!Guid.TryParse(subject, out var userId) || string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        var roles = principal.FindAll(ClaimTypes.Role).Select(claim => claim.Value).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
        var permissions = principal.FindAll("permission").Select(claim => claim.Value).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();

        return new AuthUserDto
        {
            Id = userId,
            Email = email,
            FullName = fullName,
            Status = status,
            Roles = roles,
            Permissions = permissions
        };
    }

    private static Guid CreateDeterministicUserId(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(normalizedEmail));
        Span<byte> guidBytes = stackalloc byte[16];
        hash.AsSpan(0, 16).CopyTo(guidBytes);

        return new Guid(guidBytes);
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
}
