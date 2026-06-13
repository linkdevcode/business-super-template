namespace Template.Core.Entities;

/// <summary>Represents the link between a user and a role.</summary>
public class UserRole
{
    /// <summary>Gets or sets the row identifier.</summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>Gets or sets the linked user identifier.</summary>
    public Guid UserId { get; set; }

    /// <summary>Gets or sets the linked user.</summary>
    public User User { get; set; } = null!;

    /// <summary>Gets or sets the linked role identifier.</summary>
    public Guid RoleId { get; set; }

    /// <summary>Gets or sets the linked role.</summary>
    public Role Role { get; set; } = null!;

    /// <summary>Gets or sets the time the link was created.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
