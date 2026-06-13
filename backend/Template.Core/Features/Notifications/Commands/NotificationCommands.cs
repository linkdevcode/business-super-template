using Template.Core.Entities;

namespace Template.Core.Features.Notifications;

/// <summary>Represents a notification creation request.</summary>
public sealed class CreateNotificationCommand
{
    /// <summary>Gets or sets the recipient user identifier.</summary>
    public Guid UserId { get; set; }

    /// <summary>Gets or sets the notification title.</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Gets or sets the notification content.</summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>Gets or sets the notification type.</summary>
    public NotificationType Type { get; set; } = NotificationType.Info;

    /// <summary>Gets or sets the related entity type when applicable.</summary>
    public string? EntityType { get; set; }

    /// <summary>Gets or sets the related entity identifier when applicable.</summary>
    public string? EntityId { get; set; }
}

/// <summary>Represents a request to mark a notification as read.</summary>
public sealed class MarkNotificationAsReadCommand
{
    /// <summary>Gets or sets the notification identifier.</summary>
    public Guid NotificationId { get; set; }

    /// <summary>Gets or sets the current user identifier.</summary>
    public Guid UserId { get; set; }
}

/// <summary>Represents a request to mark all notifications as read.</summary>
public sealed class MarkAllNotificationsAsReadCommand
{
    /// <summary>Gets or sets the current user identifier.</summary>
    public Guid UserId { get; set; }
}
