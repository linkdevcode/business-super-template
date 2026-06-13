using Microsoft.AspNetCore.SignalR;

namespace Template.Infrastructure.Notifications;

/// <summary>Maps the SignalR user identifier to the JWT subject claim.</summary>
public sealed class JwtUserIdProvider : IUserIdProvider
{
    /// <inheritdoc />
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User.GetUserId()?.ToString();
    }
}
