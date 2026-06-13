using System.Collections.Concurrent;
using Template.Core.Features.Notifications;

namespace Template.Infrastructure.Notifications;

/// <summary>Tracks SignalR notification connections per user.</summary>
public sealed class NotificationConnectionTracker : INotificationConnectionTracker
{
    private readonly ConcurrentDictionary<Guid, ConcurrentDictionary<string, byte>> _connectionsByUser = new();
    private readonly ConcurrentDictionary<string, Guid> _userByConnection = new(StringComparer.Ordinal);

    /// <inheritdoc />
    public void TrackConnection(Guid userId, string connectionId)
    {
        var userConnections = _connectionsByUser.GetOrAdd(userId, _ => new ConcurrentDictionary<string, byte>(StringComparer.Ordinal));
        userConnections.TryAdd(connectionId, 0);
        _userByConnection[connectionId] = userId;
    }

    /// <inheritdoc />
    public void UntrackConnection(string connectionId)
    {
        if (!_userByConnection.TryRemove(connectionId, out var userId))
        {
            return;
        }

        if (_connectionsByUser.TryGetValue(userId, out var userConnections))
        {
            userConnections.TryRemove(connectionId, out _);

            if (userConnections.IsEmpty)
            {
                _connectionsByUser.TryRemove(userId, out _);
            }
        }
    }

    /// <inheritdoc />
    public bool HasConnections(Guid userId)
    {
        return _connectionsByUser.TryGetValue(userId, out var connections) && !connections.IsEmpty;
    }
}
