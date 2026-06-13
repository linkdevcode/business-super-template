namespace Template.Infrastructure.Auth;

/// <summary>Represents the auth module configuration.</summary>
public sealed class AuthOptions
{
    /// <summary>Gets the configuration section name.</summary>
    public const string SectionName = "Auth";

    /// <summary>Gets or sets the JWT issuer.</summary>
    public string Issuer { get; set; } = string.Empty;

    /// <summary>Gets or sets the JWT audience.</summary>
    public string Audience { get; set; } = string.Empty;

    /// <summary>Gets or sets the symmetric signing secret.</summary>
    public string Secret { get; set; } = string.Empty;

    /// <summary>Gets or sets the access token lifetime in minutes.</summary>
    public int AccessTokenLifetimeMinutes { get; set; } = 15;

    /// <summary>Gets or sets the refresh token lifetime in days.</summary>
    public int RefreshTokenLifetimeDays { get; set; } = 14;

    /// <summary>Gets or sets the refresh token cookie name.</summary>
    public string RefreshCookieName { get; set; } = "template_refresh_token";

    /// <summary>Gets or sets the refresh token cookie path.</summary>
    public string RefreshCookiePath { get; set; } = "/";

    /// <summary>Gets or sets the demo account used until the business user module is available.</summary>
    public DemoAccountOptions DemoAccount { get; set; } = new();
}

/// <summary>Represents the development demo account configuration.</summary>
public sealed class DemoAccountOptions
{
    /// <summary>Gets or sets the demo email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the demo password.</summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>Gets or sets the display name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the account status.</summary>
    public string Status { get; set; } = "ACTIVE";

    /// <summary>Gets or sets the assigned role names.</summary>
    public string[] Roles { get; set; } = [];

    /// <summary>Gets or sets the assigned permission keys.</summary>
    public string[] Permissions { get; set; } = [];
}
