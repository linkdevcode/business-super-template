namespace Template.Core.Common.Models;

/// <summary>Represents an immutable audit log entry.</summary>
public class AuditLog
{
    /// <summary>Gets or sets the audit log identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the affected entity type name.</summary>
    public string EntityType { get; set; } = string.Empty;

    /// <summary>Gets or sets the affected entity identifier.</summary>
    public Guid EntityId { get; set; }

    /// <summary>Gets or sets the audit action name.</summary>
    public string Action { get; set; } = string.Empty;

    /// <summary>Gets or sets the JSON payload describing the change set.</summary>
    public string Changes { get; set; } = string.Empty;

    /// <summary>Gets or sets the identifier of the user who created the log entry.</summary>
    public Guid? CreatedBy { get; set; }

    /// <summary>Gets or sets the time the audit log was created.</summary>
    public DateTime CreatedAt { get; set; }
}
