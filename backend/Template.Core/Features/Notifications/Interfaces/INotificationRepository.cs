using Template.Core.Common.Interfaces;
using Template.Core.Common.Models;
using Template.Core.Entities;

namespace Template.Core.Features.Notifications;

/// <summary>Defines notification persistence operations.</summary>
public interface INotificationRepository : IBaseRepository<Notification>
{
    /// <summary>Gets the queryable notification source for read operations.</summary>
    IQueryable<Notification> Query();

    /// <summary>Gets a paged notification list for a specific user.</summary>
    Task<PagedResponse<Notification>> GetPagedByUserAsync(
        Guid userId,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default);

    /// <summary>Gets a tracked notification for a specific user.</summary>
    Task<Notification?> GetTrackedByIdForUserAsync(
        Guid notificationId,
        Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>Gets the unread notification count for a specific user.</summary>
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>Gets all unread notifications for a specific user in tracked form.</summary>
    Task<IReadOnlyList<Notification>> GetUnreadTrackedByUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}
