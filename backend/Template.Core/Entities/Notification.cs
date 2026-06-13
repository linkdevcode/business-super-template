using Template.Core.Common.Models;

namespace Template.Core.Entities;

/// <summary>Represents a user notification stored in the application database.</summary>
public class Notification : BaseEntity
{
    /// <summary>Gets or sets the identifier of the notification recipient.</summary>
    public Guid UserId { get; set; }

    /// <summary>Gets or sets the notification title.</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Gets or sets the notification content.</summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>Gets or sets the notification severity or kind.</summary>
    public NotificationType Type { get; set; } = NotificationType.Info;

    /// <summary>Gets or sets a value indicating whether the notification has been read.</summary>
    public bool IsRead { get; set; }

    /// <summary>Gets or sets the time the notification was marked as read.</summary>
    public DateTime? ReadAt { get; set; }

    /// <summary>Gets or sets the related entity type when the notification is tied to a record.</summary>
    public string? EntityType { get; set; }

    /// <summary>Gets or sets the related entity identifier when the notification is tied to a record.</summary>
    public string? EntityId { get; set; }

    /// <summary>Gets or sets the recipient user.</summary>
    public User? User { get; set; }
}

/// <summary>Defines the supported notification types.</summary>
public enum NotificationType
{
    Info = 0,
    Success = 1,
    Warning = 2,
    Error = 3
}
