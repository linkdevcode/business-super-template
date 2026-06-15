using Template.Core.Common.Models;

namespace Template.Core.Features.Users;

/// <summary>Represents a user list request.</summary>
public sealed class GetUsersQuery
{
    /// <summary>Gets or sets the current page number.</summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>Gets or sets the current page size.</summary>
    public int PageSize { get; set; } = 10;

    /// <summary>Gets or sets the optional search text.</summary>
    public string? SearchTerm { get; set; }

    /// <summary>Gets or sets the optional status filter.</summary>
    public string? Status { get; set; }

    /// <summary>Gets or sets the property used for sorting.</summary>
    public string? SortBy { get; set; }

    /// <summary>Gets or sets a value indicating whether sorting is descending.</summary>
    public bool SortDescending { get; set; }
}

/// <summary>Represents a user detail request.</summary>
public sealed class GetUserByIdQuery
{
    /// <summary>Gets or sets the user identifier.</summary>
    public Guid Id { get; set; }
}

/// <summary>Represents a user list row.</summary>
public sealed class UserListItemDto
{
    /// <summary>Gets or sets the user identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the display name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the account status.</summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>Gets or sets the avatar URL.</summary>
    public string? AvatarUrl { get; set; }

    /// <summary>Gets or sets the assigned role names.</summary>
    public IReadOnlyList<string> RoleNames { get; set; } = [];

    /// <summary>Gets or sets the role identifiers.</summary>
    public IReadOnlyList<Guid> RoleIds { get; set; } = [];

    /// <summary>Gets or sets the last login timestamp.</summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>Gets or sets the created timestamp.</summary>
    public DateTime CreatedAt { get; set; }
}

/// <summary>Represents the full user detail payload.</summary>
public sealed class UserDetailDto
{
    /// <summary>Gets or sets the user identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the display name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the account status.</summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>Gets or sets the avatar URL.</summary>
    public string? AvatarUrl { get; set; }

    /// <summary>Gets or sets the assigned role identifiers.</summary>
    public IReadOnlyList<Guid> RoleIds { get; set; } = [];

    /// <summary>Gets or sets the assigned role names.</summary>
    public IReadOnlyList<string> RoleNames { get; set; } = [];

    /// <summary>Gets or sets the last login timestamp.</summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>Gets or sets the created timestamp.</summary>
    public DateTime CreatedAt { get; set; }
}

/// <summary>Represents the current user profile payload.</summary>
public sealed class UserProfileDto
{
    /// <summary>Gets or sets the user identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the display name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the avatar URL.</summary>
    public string? AvatarUrl { get; set; }

    /// <summary>Gets or sets the account status.</summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>Gets or sets the assigned role names.</summary>
    public IReadOnlyList<string> Roles { get; set; } = [];
}
