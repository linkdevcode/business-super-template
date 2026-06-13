namespace Template.Core.Features.Roles;

/// <summary>Represents a request to create a role.</summary>
public sealed class CreateRoleCommand
{
    /// <summary>Gets or sets the role name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the role description.</summary>
    public string? Description { get; set; }

    /// <summary>Gets or sets the permission identifiers assigned to the role.</summary>
    public IReadOnlyList<Guid> PermissionIds { get; set; } = [];
}

/// <summary>Represents a request to update a role.</summary>
public sealed class UpdateRoleCommand
{
    /// <summary>Gets or sets the role name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the role description.</summary>
    public string? Description { get; set; }

    /// <summary>Gets or sets the permission identifiers assigned to the role.</summary>
    public IReadOnlyList<Guid> PermissionIds { get; set; } = [];
}
