using Template.Core.Common.Models;

namespace Template.Core.Entities;

/// <summary>Represents a role in the RBAC model.</summary>
public class Role : BaseEntity
{
    /// <summary>Gets or sets the unique role name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the optional role description.</summary>
    public string? Description { get; set; }

    /// <summary>Gets the user-role links.</summary>
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    /// <summary>Gets the role-permission links.</summary>
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
