using System.Security.Claims;

namespace Template.Core.Features.Auth;

/// <summary>Defines the central authentication service contract.</summary>
public interface IIdentityService
{
    /// <summary>Authenticates a user and issues a new session.</summary>
    Task<AuthLoginResult> LoginAsync(LoginCommand command, CancellationToken cancellationToken = default);

    /// <summary>Rotates the refresh token and issues a new access token.</summary>
    Task<AuthLoginResult> RefreshSessionAsync(RefreshSessionCommand command, CancellationToken cancellationToken = default);

    /// <summary>Revokes the current refresh token session.</summary>
    Task LogoutAsync(LogoutCommand command, CancellationToken cancellationToken = default);

    /// <summary>Resolves the current user from the access token claims principal.</summary>
    Task<AuthUserDto?> GetCurrentUserAsync(GetCurrentUserQuery query, ClaimsPrincipal principal, CancellationToken cancellationToken = default);
}
