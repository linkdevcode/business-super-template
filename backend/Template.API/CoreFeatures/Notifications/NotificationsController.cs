using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Template.Core.Common.Models;
using Template.Core.Features.Notifications;

namespace Template.API.CoreFeatures.Notifications;

/// <summary>Exposes notification endpoints for the current user.</summary>
[ApiController]
[Authorize]
[Route("api/notifications")]
public sealed class NotificationsController : ControllerBase
{
    private readonly GetMyNotificationsHandler _getMyNotificationsHandler;
    private readonly MarkNotificationAsReadHandler _markNotificationAsReadHandler;
    private readonly MarkAllNotificationsAsReadHandler _markAllNotificationsAsReadHandler;

    /// <summary>Creates a new notifications controller.</summary>
    public NotificationsController(
        GetMyNotificationsHandler getMyNotificationsHandler,
        MarkNotificationAsReadHandler markNotificationAsReadHandler,
        MarkAllNotificationsAsReadHandler markAllNotificationsAsReadHandler)
    {
        _getMyNotificationsHandler = getMyNotificationsHandler;
        _markNotificationAsReadHandler = markNotificationAsReadHandler;
        _markAllNotificationsAsReadHandler = markAllNotificationsAsReadHandler;
    }

    /// <summary>Gets the current user's notifications.</summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<GetMyNotificationsResult>>> GetMyNotifications(
        [FromQuery] GetMyNotificationsQuery query,
        CancellationToken cancellationToken = default)
    {
        query.UserId = GetCurrentUserId();
        var result = await _getMyNotificationsHandler.HandleAsync(query, cancellationToken);
        return Ok(ApiResponse<GetMyNotificationsResult>.Success(result));
    }

    /// <summary>Marks a single notification as read.</summary>
    [HttpPatch("{id:guid}/read")]
    public async Task<ActionResult<ApiResponse<NotificationDto>>> MarkAsRead(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var result = await _markNotificationAsReadHandler.HandleAsync(
            new MarkNotificationAsReadCommand
            {
                NotificationId = id,
                UserId = GetCurrentUserId()
            },
            cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResponse<NotificationDto>.Failure("Notification not found."));
        }

        return Ok(ApiResponse<NotificationDto>.Success(result, "Notification marked as read."));
    }

    /// <summary>Marks all current user notifications as read.</summary>
    [HttpPatch("read-all")]
    public async Task<ActionResult<ApiResponse<object>>> MarkAllAsRead(CancellationToken cancellationToken = default)
    {
        var updatedCount = await _markAllNotificationsAsReadHandler.HandleAsync(
            new MarkAllNotificationsAsReadCommand { UserId = GetCurrentUserId() },
            cancellationToken);

        return Ok(ApiResponse<object>.Success(message: $"{updatedCount} notifications marked as read."));
    }

    private Guid GetCurrentUserId()
    {
        var subject = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(subject, out var userId))
        {
            throw new UnauthorizedAccessException("Current user is missing.");
        }

        return userId;
    }
}
