using Template.Core.Common.Interfaces;
using Template.Core.Common.Models;
using Template.Core.Entities;

namespace Template.Core.Features.Users;

/// <summary>Defines user persistence operations.</summary>
public interface IUserRepository : IBaseRepository<User>
{
    /// <summary>Gets an active user by email for authentication workflows.</summary>
    Task<User?> GetActiveByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>Gets an active user by identifier for session resolution.</summary>
    Task<User?> GetActiveByIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>Gets a user by identifier including role links.</summary>
    Task<User?> GetByIdWithRolesAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Gets a tracked user by identifier including role links.</summary>
    Task<User?> GetTrackedByIdWithRolesAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Gets a paged user list.</summary>
    Task<PagedResponse<UserListItemDto>> GetPagedListAsync(
        GetUsersQuery query,
        CancellationToken cancellationToken = default);

    /// <summary>Gets the role names assigned to a user.</summary>
    Task<IReadOnlyList<string>> GetRoleNamesAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>Gets the effective permission keys assigned to a user.</summary>
    Task<IReadOnlyList<string>> GetPermissionKeysAsync(Guid userId, CancellationToken cancellationToken = default);
}
