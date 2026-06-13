namespace Template.Core.Features.Auth;

/// <summary>Represents login input for the auth module.</summary>
public sealed class LoginCommand
{
    /// <summary>Gets or sets the login email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the login password.</summary>
    public string Password { get; set; } = string.Empty;
}

/// <summary>Represents a refresh session request.</summary>
public sealed class RefreshSessionCommand
{
    /// <summary>Gets or sets the refresh token read from the secure cookie.</summary>
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>Represents a logout request.</summary>
public sealed class LogoutCommand
{
    /// <summary>Gets or sets the refresh token read from the secure cookie.</summary>
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>Represents a current user lookup request.</summary>
public sealed class GetCurrentUserQuery
{
}

/// <summary>Represents a user identity visible to the frontend.</summary>
public sealed class AuthUserDto
{
    /// <summary>Gets or sets the user identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the user email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the display name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the account status.</summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>Gets or sets the assigned role names.</summary>
    public IReadOnlyList<string> Roles { get; set; } = [];

    /// <summary>Gets or sets the effective permission keys.</summary>
    public IReadOnlyList<string> Permissions { get; set; } = [];
}

/// <summary>Represents the session payload returned to the frontend.</summary>
public sealed class AuthSessionDto
{
    /// <summary>Gets or sets the access token.</summary>
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>Gets or sets the access token expiry.</summary>
    public DateTimeOffset ExpiresAt { get; set; }

    /// <summary>Gets or sets the authenticated user.</summary>
    public AuthUserDto User { get; set; } = new();
}

/// <summary>Represents the login or refresh outcome.</summary>
public sealed class AuthLoginResult
{
    /// <summary>Gets or sets the session returned to the caller.</summary>
    public AuthSessionDto Session { get; set; } = new();

    /// <summary>Gets or sets the refresh token to be stored in the secure cookie.</summary>
    public string RefreshToken { get; set; } = string.Empty;

    /// <summary>Gets or sets the refresh token expiry.</summary>
    public DateTimeOffset RefreshTokenExpiresAt { get; set; }
}
