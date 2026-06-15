using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Template.Core.Common.Constants;
using Template.Core.Common.Models;
using Template.Core.Features.Users;
using Template.Infrastructure.Auth;

namespace Template.API.CoreFeatures.Users;

/// <summary>Exposes user management and profile endpoints.</summary>
[ApiController]
[Route("users")]
public sealed class UsersController : ControllerBase
{
    private readonly GetUsersHandler _getUsersHandler;
    private readonly GetUserByIdHandler _getUserByIdHandler;
    private readonly UpdateUserStatusHandler _updateUserStatusHandler;
    private readonly AssignUserRolesHandler _assignUserRolesHandler;
    private readonly GetProfileHandler _getProfileHandler;
    private readonly UpdateProfileHandler _updateProfileHandler;
    private readonly ChangePasswordHandler _changePasswordHandler;

    /// <summary>Creates a new controller.</summary>
    public UsersController(
        GetUsersHandler getUsersHandler,
        GetUserByIdHandler getUserByIdHandler,
        UpdateUserStatusHandler updateUserStatusHandler,
        AssignUserRolesHandler assignUserRolesHandler,
        GetProfileHandler getProfileHandler,
        UpdateProfileHandler updateProfileHandler,
        ChangePasswordHandler changePasswordHandler)
    {
        _getUsersHandler = getUsersHandler;
        _getUserByIdHandler = getUserByIdHandler;
        _updateUserStatusHandler = updateUserStatusHandler;
        _assignUserRolesHandler = assignUserRolesHandler;
        _getProfileHandler = getProfileHandler;
        _updateProfileHandler = updateProfileHandler;
        _changePasswordHandler = changePasswordHandler;
    }

    /// <summary>Gets a paged user list.</summary>
    [HttpGet]
    [HasPermission(PermissionKeys.User.Read)]
    public async Task<ActionResult<ApiResponse<PagedResponse<UserListItemDto>>>> GetAll(
        [FromQuery] GetUsersQuery query,
        CancellationToken cancellationToken = default)
    {
        var result = await _getUsersHandler.HandleAsync(query, cancellationToken);
        return Ok(ApiResponse<PagedResponse<UserListItemDto>>.Success(result));
    }

    /// <summary>Gets a single user by identifier.</summary>
    [HttpGet("{id:guid}")]
    [HasPermission(PermissionKeys.User.Read)]
    public async Task<ActionResult<ApiResponse<UserDetailDto>>> GetById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var result = await _getUserByIdHandler.HandleAsync(new GetUserByIdQuery { Id = id }, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<UserDetailDto>.Failure("User not found."));
        }

        return Ok(ApiResponse<UserDetailDto>.Success(result));
    }

    /// <summary>Updates a user status.</summary>
    [HttpPatch("{id:guid}/status")]
    [HasPermission(PermissionKeys.User.Update)]
    public async Task<ActionResult<ApiResponse<UserDetailDto>>> UpdateStatus(
        Guid id,
        [FromBody] UpdateUserStatusCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _updateUserStatusHandler.HandleAsync(id, command, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<UserDetailDto>.Failure("User not found."));
        }

        return Ok(ApiResponse<UserDetailDto>.Success(result, "User status updated successfully."));
    }

    /// <summary>Assigns roles to a user.</summary>
    [HttpPut("{id:guid}/roles")]
    [HasPermission(PermissionKeys.User.Update)]
    public async Task<ActionResult<ApiResponse<UserDetailDto>>> AssignRoles(
        Guid id,
        [FromBody] AssignUserRolesCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _assignUserRolesHandler.HandleAsync(id, command, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<UserDetailDto>.Failure("User not found."));
        }

        return Ok(ApiResponse<UserDetailDto>.Success(result, "User roles updated successfully."));
    }

    /// <summary>Gets the current user profile.</summary>
    [HttpGet("me/profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetProfile(CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        var result = await _getProfileHandler.HandleAsync(userId, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<UserProfileDto>.Failure("Profile not found."));
        }

        return Ok(ApiResponse<UserProfileDto>.Success(result));
    }

    /// <summary>Updates the current user profile.</summary>
    [HttpPut("me/profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> UpdateProfile(
        [FromBody] UpdateProfileCommand command,
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        var result = await _updateProfileHandler.HandleAsync(userId, command, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<UserProfileDto>.Failure("Profile not found."));
        }

        return Ok(ApiResponse<UserProfileDto>.Success(result, "Profile updated successfully."));
    }

    /// <summary>Changes the current user password.</summary>
    [HttpPut("me/password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword(
        [FromBody] ChangePasswordCommand command,
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        var changed = await _changePasswordHandler.HandleAsync(userId, command, cancellationToken);
        if (!changed)
        {
            return NotFound(ApiResponse<object>.Failure("Profile not found."));
        }

        return Ok(ApiResponse<object>.Success(message: "Password changed successfully."));
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
