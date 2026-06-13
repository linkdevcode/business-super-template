namespace Template.Core.Features.Permissions;

/// <summary>Represents a permission catalog request.</summary>
public sealed class GetPermissionsQuery
{
}

/// <summary>Represents a single permission item.</summary>
public sealed class PermissionDto
{
    /// <summary>Gets or sets the permission identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the permission group.</summary>
    public string Group { get; set; } = string.Empty;

    /// <summary>Gets or sets the permission key.</summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>Gets or sets the permission name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the permission description.</summary>
    public string? Description { get; set; }
}

/// <summary>Represents a grouped permission tree node.</summary>
public sealed class PermissionGroupDto
{
    /// <summary>Gets or sets the permission group name.</summary>
    public string Group { get; set; } = string.Empty;

    /// <summary>Gets or sets the permissions inside the group.</summary>
    public IReadOnlyList<PermissionDto> Permissions { get; set; } = [];
}
