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
}
