using Template.Core.Common.Interfaces;
using Template.Core.Features.Permissions;
using Template.Core.Entities;

namespace Template.Core.Features.Permissions;

/// <summary>Defines permission persistence operations.</summary>
public interface IPermissionRepository : IBaseRepository<Permission>
{
    /// <summary>Gets the permission queryable source.</summary>
    IQueryable<Permission> Query();

    /// <summary>Gets the grouped permission catalog.</summary>
    Task<IReadOnlyList<PermissionGroupDto>> GetGroupedAsync(CancellationToken cancellationToken = default);

    /// <summary>Gets permissions by identifier.</summary>
    Task<IReadOnlyList<Permission>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default);
}
