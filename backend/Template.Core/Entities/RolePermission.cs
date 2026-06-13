namespace Template.Core.Entities;

/// <summary>Represents the link between a role and a permission.</summary>
public class RolePermission
{
    /// <summary>Gets or sets the row identifier.</summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>Gets or sets the linked role identifier.</summary>
    public Guid RoleId { get; set; }

    /// <summary>Gets or sets the linked role.</summary>
    public Role Role { get; set; } = null!;

    /// <summary>Gets or sets the linked permission identifier.</summary>
    public Guid PermissionId { get; set; }

    /// <summary>Gets or sets the linked permission.</summary>
    public Permission Permission { get; set; } = null!;

    /// <summary>Gets or sets the time the link was created.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
