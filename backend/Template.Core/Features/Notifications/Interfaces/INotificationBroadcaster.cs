namespace Template.Core.Features.Notifications;

/// <summary>Broadcasts notification payloads to connected clients.</summary>
public interface INotificationBroadcaster
{
    /// <summary>Broadcasts a notification to its recipient.</summary>
    Task BroadcastAsync(NotificationDto notification, CancellationToken cancellationToken = default);
}
