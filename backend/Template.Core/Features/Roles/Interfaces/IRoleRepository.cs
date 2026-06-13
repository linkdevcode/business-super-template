using Template.Core.Common.Interfaces;
using Template.Core.Common.Models;
using Template.Core.Entities;

namespace Template.Core.Features.Roles;

/// <summary>Defines role persistence operations.</summary>
public interface IRoleRepository : IBaseRepository<Role>
{
    /// <summary>Gets the queryable role source for list and search operations.</summary>
    IQueryable<Role> Query();

    /// <summary>Gets a paged role list.</summary>
    Task<PagedResponse<RoleListItemDto>> GetPagedListAsync(GetRolesQuery query, CancellationToken cancellationToken = default);

    /// <summary>Gets a role with its permissions for update workflows.</summary>
    Task<Role?> GetTrackedByIdWithPermissionsAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Gets a role with its permissions for detail workflows.</summary>
    Task<Role?> GetByIdWithPermissionsAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Checks whether a role name already exists.</summary>
    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default);
}
