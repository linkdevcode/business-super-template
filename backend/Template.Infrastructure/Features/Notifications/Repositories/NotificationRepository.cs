using Microsoft.EntityFrameworkCore;
using NotificationEntity = Template.Core.Entities.Notification;
using Template.Core.Common.Models;
using Template.Core.Features.Notifications;
using Template.Infrastructure.Persistence;
using Template.Infrastructure.Persistence.Repositories;

namespace Template.Infrastructure.Features.Notifications.Repositories;

/// <summary>EF Core notification repository.</summary>
public sealed class NotificationRepository : BaseRepository<NotificationEntity>, INotificationRepository
{
    private readonly AppDbContext _dbContext;

    /// <summary>Creates a new repository.</summary>
    public NotificationRepository(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public IQueryable<NotificationEntity> Query()
    {
        return _dbContext.Notifications.AsNoTracking();
    }

    /// <inheritdoc />
    public async Task<PagedResponse<NotificationEntity>> GetPagedByUserAsync(
        Guid userId,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Notifications
            .AsNoTracking()
            .Where(notification => notification.UserId == userId)
            .OrderByDescending(notification => notification.CreatedAt);

        var totalRecords = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((Math.Max(pageNumber, 1) - 1) * Math.Max(pageSize, 1))
            .Take(Math.Max(pageSize, 1))
            .ToListAsync(cancellationToken);

        return PagedResponse<NotificationEntity>.Create(
            items,
            Math.Max(pageNumber, 1),
            Math.Max(pageSize, 1),
            totalRecords);
    }

    /// <inheritdoc />
    public Task<NotificationEntity?> GetTrackedByIdForUserAsync(
        Guid notificationId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return _dbContext.Notifications.FirstOrDefaultAsync(
            notification => notification.Id == notificationId && notification.UserId == userId,
            cancellationToken);
    }

    /// <inheritdoc />
    public Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return _dbContext.Notifications
            .AsNoTracking()
            .CountAsync(notification => notification.UserId == userId && !notification.IsRead, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<NotificationEntity>> GetUnreadTrackedByUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Notifications
            .Where(notification => notification.UserId == userId && !notification.IsRead)
            .ToListAsync(cancellationToken);
    }
}
