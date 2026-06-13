using Microsoft.EntityFrameworkCore;
using Template.Core.Entities;
using Template.Core.Common.Models;
using Template.Core.Features.Roles;
using Template.Infrastructure.Persistence;
using Template.Infrastructure.Persistence.Repositories;

namespace Template.Infrastructure.Features.Roles.Repositories;

/// <summary>EF Core role repository.</summary>
public sealed class RoleRepository : BaseRepository<Role>, IRoleRepository
{
    private readonly AppDbContext _dbContext;

    /// <summary>Creates a new repository.</summary>
    public RoleRepository(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public IQueryable<Role> Query()
    {
        return _dbContext.Roles.AsNoTracking();
    }

    /// <inheritdoc />
    public async Task<PagedResponse<RoleListItemDto>> GetPagedListAsync(
        GetRolesQuery query,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Role> roles = _dbContext.Roles
            .AsNoTracking()
            .Include(role => role.RolePermissions)
            .ThenInclude(rolePermission => rolePermission.Permission);

        roles = ApplySearch(roles, query.SearchTerm);
        var totalRecords = await roles.CountAsync(cancellationToken);
        var sortedRoles = ApplyOrdering(roles, query.SortBy, query.SortDescending);

        var items = await sortedRoles
            .Skip((Math.Max(query.PageNumber, 1) - 1) * Math.Max(query.PageSize, 1))
            .Take(Math.Max(query.PageSize, 1))
            .ToListAsync(cancellationToken);

        return PagedResponse<RoleListItemDto>.Create(
            items.Select(MapListItem).ToArray(),
            Math.Max(query.PageNumber, 1),
            Math.Max(query.PageSize, 1),
            totalRecords);
    }

    /// <inheritdoc />
    public Task<Role?> GetTrackedByIdWithPermissionsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Roles
            .Include(role => role.RolePermissions)
            .ThenInclude(rolePermission => rolePermission.Permission)
            .FirstOrDefaultAsync(role => role.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public Task<Role?> GetByIdWithPermissionsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Roles
            .AsNoTracking()
            .Include(role => role.RolePermissions)
            .ThenInclude(rolePermission => rolePermission.Permission)
            .FirstOrDefaultAsync(role => role.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var normalizedName = name.Trim();

        var query = _dbContext.Roles.AsNoTracking().Where(role => role.Name == normalizedName);
        if (excludeId.HasValue)
        {
            query = query.Where(role => role.Id != excludeId.Value);
        }

        return query.AnyAsync(cancellationToken);
    }

    private static IQueryable<Role> ApplySearch(IQueryable<Role> query, string? searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return query;
        }

        var normalizedSearch = searchTerm.Trim();
        return query.Where(role =>
            EF.Functions.ILike(role.Name, $"%{normalizedSearch}%")
            || (role.Description != null && EF.Functions.ILike(role.Description, $"%{normalizedSearch}%")));
    }

    private static IQueryable<Role> ApplyOrdering(
        IQueryable<Role> query,
        string? sortBy,
        bool sortDescending)
    {
        var sortProperty = sortBy?.Trim().ToLowerInvariant() switch
        {
            "name" => nameof(Role.Name),
            "updatedat" => nameof(Role.UpdatedAt),
            _ => nameof(Role.CreatedAt)
        };

        return sortDescending
            ? query.OrderByDescending(role => EF.Property<object>(role, sortProperty))
            : query.OrderBy(role => EF.Property<object>(role, sortProperty));
    }

    private static RoleListItemDto MapListItem(Role role)
    {
        var permissionKeys = role.RolePermissions
            .Select(rolePermission => rolePermission.Permission.Key)
            .Where(permissionKey => !string.IsNullOrWhiteSpace(permissionKey))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(permissionKey => permissionKey)
            .ToArray();

        return new RoleListItemDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            PermissionCount = permissionKeys.Length,
            PermissionKeys = permissionKeys
        };
    }
}
