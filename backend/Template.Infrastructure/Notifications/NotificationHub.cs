using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Template.Core.Features.Notifications;

namespace Template.Infrastructure.Notifications;

/// <summary>SignalR hub used to push real-time notifications to authenticated users.</summary>
[Authorize]
public sealed class NotificationHub : Hub
{
    private readonly INotificationConnectionTracker _connectionTracker;

    /// <summary>Creates a new notification hub.</summary>
    public NotificationHub(INotificationConnectionTracker connectionTracker)
    {
        _connectionTracker = connectionTracker;
    }

    /// <inheritdoc />
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User.GetUserId();
        if (userId is null)
        {
            throw new HubException("Authenticated user is required.");
        }

        _connectionTracker.TrackConnection(userId.Value, Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    /// <inheritdoc />
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _connectionTracker.UntrackConnection(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
