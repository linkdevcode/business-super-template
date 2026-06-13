namespace Template.Core.Features.Notifications;

/// <summary>Tracks active notification connections per user.</summary>
public interface INotificationConnectionTracker
{
    /// <summary>Tracks a new connection for the specified user.</summary>
    void TrackConnection(Guid userId, string connectionId);

    /// <summary>Removes a connection from the tracker.</summary>
    void UntrackConnection(string connectionId);

    /// <summary>Determines whether the specified user currently has any active connections.</summary>
    bool HasConnections(Guid userId);
}
