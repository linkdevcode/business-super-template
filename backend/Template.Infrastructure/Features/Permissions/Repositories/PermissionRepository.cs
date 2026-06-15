using Microsoft.EntityFrameworkCore;
using Template.Core.Entities;
using Template.Core.Features.Permissions;
using Template.Infrastructure.Persistence;
using Template.Infrastructure.Persistence.Repositories;

namespace Template.Infrastructure.Features.Permissions.Repositories;

/// <summary>EF Core permission repository.</summary>
public sealed class PermissionRepository : BaseRepository<Permission>, IPermissionRepository
{
    private readonly AppDbContext _dbContext;

    /// <summary>Creates a new repository.</summary>
    public PermissionRepository(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public IQueryable<Permission> Query()
    {
        return _dbContext.Permissions.AsNoTracking();
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<PermissionGroupDto>> GetGroupedAsync(CancellationToken cancellationToken = default)
    {
        var permissions = await Query()
            .OrderBy(permission => permission.Key)
            .ThenBy(permission => permission.Name)
            .ToListAsync(cancellationToken);

        return permissions
            .GroupBy(permission => GetPermissionGroup(permission))
            .OrderBy(group => group.Key)
            .Select(group => new PermissionGroupDto
            {
                Group = group.Key,
                Permissions = group
                    .Select(permission => new PermissionDto
                    {
                        Id = permission.Id,
                        Group = GetPermissionGroup(permission),
                        Key = permission.Key,
                        Name = permission.Name,
                        Description = permission.Description
                    })
                    .ToArray()
            })
            .ToArray();
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Permission>> GetByIdsAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken = default)
    {
        var normalizedIds = ids.Where(id => id != Guid.Empty).Distinct().ToArray();
        if (normalizedIds.Length == 0)
        {
            return [];
        }

        return await _dbContext.Permissions
            .AsNoTracking()
            .Where(permission => normalizedIds.Contains(permission.Id))
            .ToListAsync(cancellationToken);
    }

    private static string GetPermissionGroup(Permission permission)
    {
        var permissionKey = permission.Key.Trim();
        var separatorIndex = permissionKey.IndexOf('.');

        return separatorIndex > 0
            ? permissionKey[..separatorIndex]
            : "General";
    }
}
