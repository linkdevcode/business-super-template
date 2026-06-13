using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Template.Core.Common.Models;
using Template.Core.Features.Auth;
using Template.Infrastructure.Auth;

namespace Template.API.CoreFeatures.Auth;

/// <summary>Exposes authentication endpoints for the platform module.</summary>
[ApiController]
[Route("auth")]
public sealed class AuthController : ControllerBase
{
    private readonly LoginHandler _loginHandler;
    private readonly RefreshSessionHandler _refreshSessionHandler;
    private readonly LogoutHandler _logoutHandler;
    private readonly GetCurrentUserHandler _getCurrentUserHandler;
    private readonly AuthOptions _authOptions;

    /// <summary>Creates a new auth controller.</summary>
    public AuthController(
        LoginHandler loginHandler,
        RefreshSessionHandler refreshSessionHandler,
        LogoutHandler logoutHandler,
        GetCurrentUserHandler getCurrentUserHandler,
        IOptions<AuthOptions> authOptions)
    {
        _loginHandler = loginHandler;
        _refreshSessionHandler = refreshSessionHandler;
        _logoutHandler = logoutHandler;
        _getCurrentUserHandler = getCurrentUserHandler;
        _authOptions = authOptions.Value;
    }

    /// <summary>Authenticates the user and sets the refresh token cookie.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthSessionDto>>> Login(
        [FromBody] LoginCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _loginHandler.HandleAsync(command, cancellationToken);
        WriteRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAt);

        return Ok(ApiResponse<AuthSessionDto>.Success(result.Session, "Signed in successfully."));
    }

    /// <summary>Rotates the refresh token and returns a new session.</summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthSessionDto>>> Refresh(CancellationToken cancellationToken = default)
    {
        var refreshToken = ReadRefreshTokenCookie();
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return Unauthorized(ApiResponse<AuthSessionDto>.Failure("Refresh session is missing."));
        }

        var result = await _refreshSessionHandler.HandleAsync(
            new RefreshSessionCommand { RefreshToken = refreshToken },
            cancellationToken);

        WriteRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAt);

        return Ok(ApiResponse<AuthSessionDto>.Success(result.Session, "Session refreshed successfully."));
    }

    /// <summary>Revokes the current session and clears the cookie.</summary>
    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> Logout(CancellationToken cancellationToken = default)
    {
        var refreshToken = ReadRefreshTokenCookie();
        await _logoutHandler.HandleAsync(new LogoutCommand { RefreshToken = refreshToken }, cancellationToken);
        ClearRefreshTokenCookie();

        return Ok(ApiResponse<object>.Success(message: "Signed out successfully."));
    }

    /// <summary>Returns the authenticated user.</summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<AuthUserDto>>> GetCurrentUser(CancellationToken cancellationToken = default)
    {
        var user = await _getCurrentUserHandler.HandleAsync(new GetCurrentUserQuery(), User, cancellationToken);

        if (user is null)
        {
            return Unauthorized(ApiResponse<AuthUserDto>.Failure("Current user could not be resolved."));
        }

        return Ok(ApiResponse<AuthUserDto>.Success(user));
    }

    private string ReadRefreshTokenCookie()
    {
        return Request.Cookies.TryGetValue(_authOptions.RefreshCookieName, out var refreshToken)
            ? refreshToken ?? string.Empty
            : string.Empty;
    }

    private void WriteRefreshTokenCookie(string refreshToken, DateTimeOffset expiresAt)
    {
        Response.Cookies.Append(
            _authOptions.RefreshCookieName,
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = expiresAt,
                Path = _authOptions.RefreshCookiePath
            });
    }

    private void ClearRefreshTokenCookie()
    {
        Response.Cookies.Delete(
            _authOptions.RefreshCookieName,
            new CookieOptions
            {
                Path = _authOptions.RefreshCookiePath
            });
    }
}
