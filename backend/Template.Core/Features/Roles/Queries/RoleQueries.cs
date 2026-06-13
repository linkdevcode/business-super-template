using Template.Core.Common.Models;

namespace Template.Core.Features.Roles;

/// <summary>Represents a role list request.</summary>
public sealed class GetRolesQuery
{
    /// <summary>Gets or sets the current page number.</summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>Gets or sets the current page size.</summary>
    public int PageSize { get; set; } = 10;

    /// <summary>Gets or sets the optional search text.</summary>
    public string? SearchTerm { get; set; }

    /// <summary>Gets or sets the property used for sorting.</summary>
    public string? SortBy { get; set; }

    /// <summary>Gets or sets a value indicating whether sorting is descending.</summary>
    public bool SortDescending { get; set; }
}

/// <summary>Represents a role detail request.</summary>
public sealed class GetRoleByIdQuery
{
    /// <summary>Gets or sets the role identifier.</summary>
    public Guid Id { get; set; }
}

/// <summary>Represents a role list row.</summary>
public sealed class RoleListItemDto
{
    /// <summary>Gets or sets the role identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the role name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the role description.</summary>
    public string? Description { get; set; }

    /// <summary>Gets or sets the total number of permissions assigned to the role.</summary>
    public int PermissionCount { get; set; }

    /// <summary>Gets or sets the assigned permission keys.</summary>
    public IReadOnlyList<string> PermissionKeys { get; set; } = [];
}

/// <summary>Represents the full role detail payload.</summary>
public sealed class RoleDetailDto
{
    /// <summary>Gets or sets the role identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the role name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the role description.</summary>
    public string? Description { get; set; }

    /// <summary>Gets or sets the assigned permission identifiers.</summary>
    public IReadOnlyList<Guid> PermissionIds { get; set; } = [];

    /// <summary>Gets or sets the assigned permission keys.</summary>
    public IReadOnlyList<string> PermissionKeys { get; set; } = [];
}
