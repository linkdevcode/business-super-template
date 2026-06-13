namespace Template.Core.Entities;

/// <summary>Represents a system configuration record.</summary>
public class SystemSetting
{
    /// <summary>Gets or sets the row identifier.</summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>Gets or sets the configuration key.</summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>Gets or sets the configuration group.</summary>
    public string Group { get; set; } = string.Empty;

    /// <summary>Gets or sets the configuration description.</summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>Gets or sets the JSON payload stored for the setting.</summary>
    public string Value { get; set; } = string.Empty;

    /// <summary>Gets or sets the time the setting was created.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Gets or sets the time the setting was last updated.</summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Gets or sets the user who last updated the setting.</summary>
    public string? UpdatedBy { get; set; }
}
