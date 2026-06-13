using Template.Core.Common.Models;

namespace Template.Core.Entities;

/// <summary>Represents a system user.</summary>
public class User : BaseEntity
{
    /// <summary>Gets or sets the unique email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the display name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the optional avatar URL.</summary>
    public string? AvatarUrl { get; set; }

    /// <summary>Gets or sets the account status.</summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>Gets or sets the last login time, when available.</summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>Gets the user-role links.</summary>
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
