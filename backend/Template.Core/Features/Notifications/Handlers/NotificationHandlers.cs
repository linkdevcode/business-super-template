using Template.Core.Common.Interfaces;
using Template.Core.Common.Models;
using Template.Core.Entities;
using NotificationEntity = Template.Core.Entities.Notification;

namespace Template.Core.Features.Notifications;

/// <summary>Handles notification creation.</summary>
public sealed class CreateNotificationHandler
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationBroadcaster _notificationBroadcaster;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new notification creation handler.</summary>
    public CreateNotificationHandler(
        INotificationRepository notificationRepository,
        INotificationBroadcaster notificationBroadcaster,
        IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _notificationBroadcaster = notificationBroadcaster;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Creates, persists, and broadcasts a notification.</summary>
    public async Task<NotificationDto> HandleAsync(
        CreateNotificationCommand command,
        CancellationToken cancellationToken = default)
    {
        ValidateCommand(command);

        var notification = new NotificationEntity
        {
            UserId = command.UserId,
            Title = command.Title.Trim(),
            Content = command.Content.Trim(),
            Type = command.Type,
            EntityType = NormalizeOptionalValue(command.EntityType),
            EntityId = NormalizeOptionalValue(command.EntityId)
        };

        await _notificationRepository.AddAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = NotificationHandlerMapper.ToDto(notification);
        await _notificationBroadcaster.BroadcastAsync(dto, cancellationToken);
        return dto;
    }

    private static void ValidateCommand(CreateNotificationCommand command)
    {
        if (command.UserId == Guid.Empty)
        {
            throw new ArgumentException("Recipient user is required.");
        }

        if (string.IsNullOrWhiteSpace(command.Title))
        {
            throw new ArgumentException("Notification title is required.");
        }

        if (string.IsNullOrWhiteSpace(command.Content))
        {
            throw new ArgumentException("Notification content is required.");
        }
    }

    private static string? NormalizeOptionalValue(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}

/// <summary>Handles read-state changes for a single notification.</summary>
public sealed class MarkNotificationAsReadHandler
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public MarkNotificationAsReadHandler(
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Marks the selected notification as read when it belongs to the current user.</summary>
    public async Task<NotificationDto?> HandleAsync(
        MarkNotificationAsReadCommand command,
        CancellationToken cancellationToken = default)
    {
        if (command.NotificationId == Guid.Empty || command.UserId == Guid.Empty)
        {
            throw new ArgumentException("Notification and user identifiers are required.");
        }

        var notification = await _notificationRepository.GetTrackedByIdForUserAsync(
            command.NotificationId,
            command.UserId,
            cancellationToken);

        if (notification is null)
        {
            return null;
        }

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            _notificationRepository.Update(notification);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return NotificationHandlerMapper.ToDto(notification);
    }
}

/// <summary>Handles bulk read-state updates for the current user.</summary>
public sealed class MarkAllNotificationsAsReadHandler
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public MarkAllNotificationsAsReadHandler(
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Marks all unread notifications as read for the current user.</summary>
    public async Task<int> HandleAsync(
        MarkAllNotificationsAsReadCommand command,
        CancellationToken cancellationToken = default)
    {
        if (command.UserId == Guid.Empty)
        {
            throw new ArgumentException("Current user is required.");
        }

        var notifications = await _notificationRepository.GetUnreadTrackedByUserAsync(
            command.UserId,
            cancellationToken);

        if (notifications.Count == 0)
        {
            return 0;
        }

        var utcNow = DateTime.UtcNow;
        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = utcNow;
            _notificationRepository.Update(notification);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return notifications.Count;
    }
}

/// <summary>Handles current user notification feed queries.</summary>
public sealed class GetMyNotificationsHandler
{
    private readonly INotificationRepository _notificationRepository;

    /// <summary>Creates a new handler.</summary>
    public GetMyNotificationsHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    /// <summary>Returns the current user's notifications using paged read-only access.</summary>
    public async Task<GetMyNotificationsResult> HandleAsync(
        GetMyNotificationsQuery query,
        CancellationToken cancellationToken = default)
    {
        if (query.UserId == Guid.Empty)
        {
            throw new ArgumentException("Current user is required.");
        }

        var pageNumber = Math.Max(query.PageNumber, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var page = await _notificationRepository.GetPagedByUserAsync(
            query.UserId,
            pageNumber,
            pageSize,
            cancellationToken);
        var unreadCount = await _notificationRepository.GetUnreadCountAsync(query.UserId, cancellationToken);

        return new GetMyNotificationsResult
        {
            Items = page.Items.Select(NotificationHandlerMapper.ToDto).ToArray(),
            PageNumber = page.PageNumber,
            PageSize = page.PageSize,
            TotalRecords = page.TotalRecords,
            TotalPages = page.TotalPages,
            UnreadCount = unreadCount
        };
    }
}

internal static class NotificationHandlerMapper
{
    public static NotificationDto ToDto(NotificationEntity notification)
    {
        return new NotificationDto
        {
            Id = notification.Id,
            UserId = notification.UserId,
            Title = notification.Title,
            Content = notification.Content,
            Type = notification.Type.ToString(),
            IsRead = notification.IsRead,
            ReadAt = notification.ReadAt,
            EntityType = notification.EntityType,
            EntityId = notification.EntityId,
            CreatedAt = notification.CreatedAt,
            UpdatedAt = notification.UpdatedAt
        };
    }
}
