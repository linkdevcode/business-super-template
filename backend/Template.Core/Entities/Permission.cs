using Template.Core.Common.Models;

namespace Template.Core.Entities;

/// <summary>Represents a permission in the RBAC model.</summary>
public class Permission : BaseEntity
{
    /// <summary>Gets or sets the unique permission key.</summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>Gets or sets the display name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the optional permission description.</summary>
    public string? Description { get; set; }

    /// <summary>Gets the role-permission links.</summary>
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
