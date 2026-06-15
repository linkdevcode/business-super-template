namespace Template.Core.Features.Users;

/// <summary>Represents a user status update request.</summary>
public sealed class UpdateUserStatusCommand
{
    /// <summary>Gets or sets the target status.</summary>
    public string Status { get; set; } = string.Empty;
}

/// <summary>Represents a user role assignment request.</summary>
public sealed class AssignUserRolesCommand
{
    /// <summary>Gets or sets the role identifiers to assign.</summary>
    public IReadOnlyList<Guid> RoleIds { get; set; } = [];
}

/// <summary>Represents a profile update request for the current user.</summary>
public sealed class UpdateProfileCommand
{
    /// <summary>Gets or sets the display name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the avatar URL.</summary>
    public string? AvatarUrl { get; set; }
}

/// <summary>Represents a password change request for the current user.</summary>
public sealed class ChangePasswordCommand
{
    /// <summary>Gets or sets the current password.</summary>
    public string CurrentPassword { get; set; } = string.Empty;

    /// <summary>Gets or sets the new password.</summary>
    public string NewPassword { get; set; } = string.Empty;
}
