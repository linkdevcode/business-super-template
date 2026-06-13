using Template.Core.Common.Models;

namespace Template.Core.Features.Notifications;

/// <summary>Represents a request for the current user's notifications.</summary>
public sealed class GetMyNotificationsQuery
{
    /// <summary>Gets or sets the current user identifier.</summary>
    public Guid UserId { get; set; }

    /// <summary>Gets or sets the page number.</summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>Gets or sets the page size.</summary>
    public int PageSize { get; set; } = 10;
}

/// <summary>Represents a notification response payload.</summary>
public sealed class NotificationDto
{
    /// <summary>Gets or sets the notification identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the recipient user identifier.</summary>
    public Guid UserId { get; set; }

    /// <summary>Gets or sets the notification title.</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Gets or sets the notification content.</summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>Gets or sets the notification type.</summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>Gets or sets a value indicating whether the notification has been read.</summary>
    public bool IsRead { get; set; }

    /// <summary>Gets or sets the time the notification was marked as read.</summary>
    public DateTime? ReadAt { get; set; }

    /// <summary>Gets or sets the related entity type when applicable.</summary>
    public string? EntityType { get; set; }

    /// <summary>Gets or sets the related entity identifier when applicable.</summary>
    public string? EntityId { get; set; }

    /// <summary>Gets or sets the creation timestamp.</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Gets or sets the last update timestamp.</summary>
    public DateTime UpdatedAt { get; set; }
}

/// <summary>Represents the current user's paged notification feed.</summary>
public sealed class GetMyNotificationsResult
{
    /// <summary>Gets or sets the notifications in the current page.</summary>
    public IReadOnlyList<NotificationDto> Items { get; set; } = [];

    /// <summary>Gets or sets the current page number.</summary>
    public int PageNumber { get; set; }

    /// <summary>Gets or sets the page size.</summary>
    public int PageSize { get; set; }

    /// <summary>Gets or sets the total number of matching records.</summary>
    public int TotalRecords { get; set; }

    /// <summary>Gets the total number of pages.</summary>
    public int TotalPages { get; set; }

    /// <summary>Gets or sets the total unread notifications for the current user.</summary>
    public int UnreadCount { get; set; }
}
