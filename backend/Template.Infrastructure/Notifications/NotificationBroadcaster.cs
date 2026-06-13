using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Template.Core.Features.Notifications;

namespace Template.Infrastructure.Notifications;

/// <summary>SignalR-based notification broadcaster.</summary>
public sealed class NotificationBroadcaster : INotificationBroadcaster
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<NotificationBroadcaster> _logger;

    /// <summary>Creates a new broadcaster.</summary>
    public NotificationBroadcaster(
        IHubContext<NotificationHub> hubContext,
        ILogger<NotificationBroadcaster> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task BroadcastAsync(NotificationDto notification, CancellationToken cancellationToken = default)
    {
        if (notification.UserId == Guid.Empty)
        {
            return;
        }

        try
        {
            await _hubContext.Clients.User(notification.UserId.ToString())
                .SendAsync("ReceiveNotification", notification, cancellationToken);
        }
        catch (Exception exception)
        {
            _logger.LogWarning(
                exception,
                "Failed to broadcast notification {NotificationId} to user {UserId}.",
                notification.Id,
                notification.UserId);
        }
    }
}
