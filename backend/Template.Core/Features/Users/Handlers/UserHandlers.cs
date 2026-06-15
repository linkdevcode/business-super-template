using Template.Core.Common.Constants;
using Template.Core.Common.Interfaces;
using Template.Core.Common.Models;
using Template.Core.Entities;
using Template.Core.Features.Auth;
using Template.Core.Features.Roles;

namespace Template.Core.Features.Users;

/// <summary>Handles user list queries.</summary>
public sealed class GetUsersHandler
{
    private readonly IUserRepository _userRepository;

    /// <summary>Creates a new handler.</summary>
    public GetUsersHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <summary>Returns a paged user list.</summary>
    public async Task<PagedResponse<UserListItemDto>> HandleAsync(
        GetUsersQuery query,
        CancellationToken cancellationToken = default)
    {
        return await _userRepository.GetPagedListAsync(query, cancellationToken);
    }
}

/// <summary>Handles user detail queries.</summary>
public sealed class GetUserByIdHandler
{
    private readonly IUserRepository _userRepository;

    /// <summary>Creates a new handler.</summary>
    public GetUserByIdHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <summary>Returns user details.</summary>
    public async Task<UserDetailDto?> HandleAsync(
        GetUserByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdWithRolesAsync(query.Id, cancellationToken);
        return user is null ? null : UserHandlerMapper.ToDetail(user);
    }
}

/// <summary>Handles user status updates.</summary>
public sealed class UpdateUserStatusHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public UpdateUserStatusHandler(IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Updates a user status.</summary>
    public async Task<UserDetailDto?> HandleAsync(
        Guid id,
        UpdateUserStatusCommand command,
        CancellationToken cancellationToken = default)
    {
        var normalizedStatus = NormalizeStatus(command.Status);
        var user = await _userRepository.GetTrackedByIdWithRolesAsync(id, cancellationToken);
        if (user is null)
        {
            return null;
        }

        user.Status = normalizedStatus;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return UserHandlerMapper.ToDetail(user);
    }

    private static string NormalizeStatus(string status)
    {
        var normalizedStatus = status.Trim().ToUpperInvariant();
        if (normalizedStatus is not UserStatuses.Active and not UserStatuses.Inactive)
        {
            throw new InvalidOperationException("Status must be ACTIVE or INACTIVE.");
        }

        return normalizedStatus;
    }
}

/// <summary>Handles user role assignment.</summary>
public sealed class AssignUserRolesHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public AssignUserRolesHandler(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Assigns roles to a user.</summary>
    public async Task<UserDetailDto?> HandleAsync(
        Guid id,
        AssignUserRolesCommand command,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetTrackedByIdWithRolesAsync(id, cancellationToken);
        if (user is null)
        {
            return null;
        }

        var roleIds = command.RoleIds
            .Where(roleId => roleId != Guid.Empty)
            .Distinct()
            .ToArray();

        if (roleIds.Length > 0)
        {
            var roles = await _roleRepository.GetByIdsAsync(roleIds, cancellationToken);
            if (roles.Count != roleIds.Length)
            {
                throw new InvalidOperationException("One or more roles were not found.");
            }
        }

        user.UserRoles.Clear();
        foreach (var roleId in roleIds)
        {
            user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = roleId });
        }

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedUser = await _userRepository.GetByIdWithRolesAsync(user.Id, cancellationToken) ?? user;
        return UserHandlerMapper.ToDetail(updatedUser);
    }
}

/// <summary>Handles current user profile queries.</summary>
public sealed class GetProfileHandler
{
    private readonly IUserRepository _userRepository;

    /// <summary>Creates a new handler.</summary>
    public GetProfileHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <summary>Returns the profile for the current user.</summary>
    public async Task<UserProfileDto?> HandleAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdWithRolesAsync(userId, cancellationToken);
        return user is null ? null : UserHandlerMapper.ToProfile(user);
    }
}

/// <summary>Handles current user profile updates.</summary>
public sealed class UpdateProfileHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public UpdateProfileHandler(IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Updates the current user profile.</summary>
    public async Task<UserProfileDto?> HandleAsync(
        Guid userId,
        UpdateProfileCommand command,
        CancellationToken cancellationToken = default)
    {
        var fullName = command.FullName.Trim();
        if (string.IsNullOrWhiteSpace(fullName))
        {
            throw new InvalidOperationException("Full name is required.");
        }

        var user = await _userRepository.GetTrackedByIdWithRolesAsync(userId, cancellationToken);
        if (user is null)
        {
            return null;
        }

        user.FullName = fullName;
        user.AvatarUrl = string.IsNullOrWhiteSpace(command.AvatarUrl) ? null : command.AvatarUrl.Trim();

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return UserHandlerMapper.ToProfile(user);
    }
}

/// <summary>Handles password changes for the current user.</summary>
public sealed class ChangePasswordHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public ChangePasswordHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Changes the current user password.</summary>
    public async Task<bool> HandleAsync(
        Guid userId,
        ChangePasswordCommand command,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(command.CurrentPassword))
        {
            throw new InvalidOperationException("Current password is required.");
        }

        if (string.IsNullOrWhiteSpace(command.NewPassword) || command.NewPassword.Length < 8)
        {
            throw new InvalidOperationException("New password must be at least 8 characters.");
        }

        var user = await _userRepository.GetTrackedByIdWithRolesAsync(userId, cancellationToken);
        if (user is null)
        {
            return false;
        }

        if (!_passwordHasher.VerifyPassword(command.CurrentPassword, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Current password is incorrect.");
        }

        user.PasswordHash = _passwordHasher.HashPassword(command.NewPassword);
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}

/// <summary>Maps user entities to response DTOs.</summary>
internal static class UserHandlerMapper
{
    /// <summary>Maps a user entity to a detail DTO.</summary>
    public static UserDetailDto ToDetail(User user)
    {
        var roleNames = user.UserRoles
            .Select(userRole => userRole.Role.Name)
            .Where(roleName => !string.IsNullOrWhiteSpace(roleName))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(roleName => roleName)
            .ToArray();

        var roleIds = user.UserRoles
            .Select(userRole => userRole.RoleId)
            .Distinct()
            .ToArray();

        return new UserDetailDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Status = user.Status,
            AvatarUrl = user.AvatarUrl,
            RoleIds = roleIds,
            RoleNames = roleNames,
            LastLoginAt = user.LastLoginAt,
            CreatedAt = user.CreatedAt
        };
    }

    /// <summary>Maps a user entity to a profile DTO.</summary>
    public static UserProfileDto ToProfile(User user)
    {
        var roleNames = user.UserRoles
            .Select(userRole => userRole.Role.Name)
            .Where(roleName => !string.IsNullOrWhiteSpace(roleName))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(roleName => roleName)
            .ToArray();

        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            Status = user.Status,
            Roles = roleNames
        };
    }
}
