namespace Template.Core.Features.SystemSettings;

/// <summary>Represents the system settings payload persisted as JSONB.</summary>
public sealed class SystemSettingsPayload
{
    /// <summary>Gets or sets the application configuration block.</summary>
    public SystemAppSettings App { get; set; } = new();

    /// <summary>Gets or sets the mail configuration block.</summary>
    public SystemMailSettings Mail { get; set; } = new();

    /// <summary>Gets or sets the branding configuration block.</summary>
    public SystemBrandingSettings Branding { get; set; } = new();
}

/// <summary>Represents the application-related settings.</summary>
public sealed class SystemAppSettings
{
    /// <summary>Gets or sets the display name of the application.</summary>
    public string AppName { get; set; } = string.Empty;

    /// <summary>Gets or sets the public application URL.</summary>
    public string AppUrl { get; set; } = string.Empty;

    /// <summary>Gets or sets the backend API base URL.</summary>
    public string ApiBaseUrl { get; set; } = string.Empty;

    /// <summary>Gets or sets the default time zone identifier.</summary>
    public string TimeZone { get; set; } = string.Empty;
}

/// <summary>Represents the mail-related settings.</summary>
public sealed class SystemMailSettings
{
    /// <summary>Gets or sets the SMTP host name.</summary>
    public string SmtpHost { get; set; } = string.Empty;

    /// <summary>Gets or sets the SMTP port.</summary>
    public int SmtpPort { get; set; } = 587;

    /// <summary>Gets or sets the SMTP username.</summary>
    public string SmtpUsername { get; set; } = string.Empty;

    /// <summary>Gets or sets the SMTP password.</summary>
    public string SmtpPassword { get; set; } = string.Empty;

    /// <summary>Gets or sets the sender email address.</summary>
    public string FromEmail { get; set; } = string.Empty;

    /// <summary>Gets or sets the sender display name.</summary>
    public string FromName { get; set; } = string.Empty;

    /// <summary>Gets or sets a value indicating whether TLS is enabled.</summary>
    public bool EnableSsl { get; set; } = true;
}

/// <summary>Represents the branding-related settings.</summary>
public sealed class SystemBrandingSettings
{
    /// <summary>Gets or sets the company display name.</summary>
    public string CompanyName { get; set; } = string.Empty;

    /// <summary>Gets or sets the company support email.</summary>
    public string SupportEmail { get; set; } = string.Empty;

    /// <summary>Gets or sets the logo URL.</summary>
    public string LogoUrl { get; set; } = string.Empty;
}

/// <summary>Represents a query for the current system settings record.</summary>
public sealed class GetSystemSettingsQuery
{
    /// <summary>Gets or sets the settings key.</summary>
    public string Key { get; set; } = "default";
}

/// <summary>Represents a system settings save command.</summary>
public sealed class SaveSystemSettingsCommand
{
    /// <summary>Gets or sets the settings key.</summary>
    public string Key { get; set; } = "default";

    /// <summary>Gets or sets the settings group.</summary>
    public string Group { get; set; } = "system";

    /// <summary>Gets or sets the settings description.</summary>
    public string Description { get; set; } = "System configuration";

    /// <summary>Gets or sets the current settings payload.</summary>
    public SystemSettingsPayload Value { get; set; } = new();

    /// <summary>Gets or sets the identifier of the updating user.</summary>
    public string? UpdatedBy { get; set; }
}

/// <summary>Represents a persisted system settings record.</summary>
public sealed class SystemSettingDto
{
    /// <summary>Gets or sets the settings identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the settings key.</summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>Gets or sets the settings group.</summary>
    public string Group { get; set; } = string.Empty;

    /// <summary>Gets or sets the settings description.</summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>Gets or sets the settings payload.</summary>
    public SystemSettingsPayload Value { get; set; } = new();

    /// <summary>Gets or sets the identifier of the last user who updated the settings.</summary>
    public string? UpdatedBy { get; set; }

    /// <summary>Gets or sets the creation time.</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Gets or sets the last update time.</summary>
    public DateTime UpdatedAt { get; set; }
}
