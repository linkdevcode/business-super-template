using Microsoft.EntityFrameworkCore;
using Template.Core.Common.Constants;
using Template.Core.Common.Models;
using Template.Core.Entities;
using Template.Core.Features.Users;
using Template.Infrastructure.Persistence;
using Template.Infrastructure.Persistence.Repositories;

namespace Template.Infrastructure.Features.Users.Repositories;

/// <summary>EF Core user repository.</summary>
public sealed class UserRepository : BaseRepository<User>, IUserRepository
{
    private readonly AppDbContext _dbContext;

    /// <summary>Creates a new repository.</summary>
    public UserRepository(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public Task<User?> GetActiveByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim();

        return _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                user => user.Email == normalizedEmail && user.Status == UserStatuses.Active,
                cancellationToken);
    }

    /// <inheritdoc />
    public Task<User?> GetActiveByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                user => user.Id == userId && user.Status == UserStatuses.Active,
                cancellationToken);
    }

    /// <inheritdoc />
    public Task<User?> GetByIdWithRolesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Users
            .AsNoTracking()
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .FirstOrDefaultAsync(user => user.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public Task<User?> GetTrackedByIdWithRolesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Users
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .FirstOrDefaultAsync(user => user.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<PagedResponse<UserListItemDto>> GetPagedListAsync(
        GetUsersQuery query,
        CancellationToken cancellationToken = default)
    {
        IQueryable<User> users = _dbContext.Users
            .AsNoTracking()
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role);

        users = ApplySearch(users, query.SearchTerm);
        users = ApplyStatusFilter(users, query.Status);

        var totalRecords = await users.CountAsync(cancellationToken);
        var sortedUsers = ApplyOrdering(users, query.SortBy, query.SortDescending);

        var items = await sortedUsers
            .Skip((Math.Max(query.PageNumber, 1) - 1) * Math.Max(query.PageSize, 1))
            .Take(Math.Max(query.PageSize, 1))
            .ToListAsync(cancellationToken);

        return PagedResponse<UserListItemDto>.Create(
            items.Select(MapListItem).ToArray(),
            Math.Max(query.PageNumber, 1),
            Math.Max(query.PageSize, 1),
            totalRecords);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<string>> GetRoleNamesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserRoles
            .AsNoTracking()
            .Where(userRole => userRole.UserId == userId)
            .Select(userRole => userRole.Role.Name)
            .Distinct()
            .ToArrayAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<string>> GetPermissionKeysAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await (
                from userRole in _dbContext.UserRoles.AsNoTracking()
                join rolePermission in _dbContext.RolePermissions.AsNoTracking()
                    on userRole.RoleId equals rolePermission.RoleId
                join permission in _dbContext.Permissions.AsNoTracking()
                    on rolePermission.PermissionId equals permission.Id
                where userRole.UserId == userId
                select permission.Key)
            .Distinct()
            .ToArrayAsync(cancellationToken);
    }

    private static IQueryable<User> ApplySearch(IQueryable<User> query, string? searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return query;
        }

        var normalizedSearch = searchTerm.Trim();
        return query.Where(user =>
            EF.Functions.ILike(user.Email, $"%{normalizedSearch}%")
            || EF.Functions.ILike(user.FullName, $"%{normalizedSearch}%"));
    }

    private static IQueryable<User> ApplyStatusFilter(IQueryable<User> query, string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return query;
        }

        var normalizedStatus = status.Trim().ToUpperInvariant();
        return query.Where(user => user.Status == normalizedStatus);
    }

    private static IQueryable<User> ApplyOrdering(
        IQueryable<User> query,
        string? sortBy,
        bool sortDescending)
    {
        var sortProperty = sortBy?.Trim().ToLowerInvariant() switch
        {
            "email" => nameof(User.Email),
            "fullname" => nameof(User.FullName),
            "status" => nameof(User.Status),
            "lastloginat" => nameof(User.LastLoginAt),
            "updatedat" => nameof(User.UpdatedAt),
            _ => nameof(User.CreatedAt)
        };

        return sortDescending
            ? query.OrderByDescending(user => EF.Property<object>(user, sortProperty))
            : query.OrderBy(user => EF.Property<object>(user, sortProperty));
    }

    private static UserListItemDto MapListItem(User user)
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

        return new UserListItemDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Status = user.Status,
            AvatarUrl = user.AvatarUrl,
            RoleNames = roleNames,
            RoleIds = roleIds,
            LastLoginAt = user.LastLoginAt,
            CreatedAt = user.CreatedAt
        };
    }
}
