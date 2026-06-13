using Template.Core.Common.Interfaces;
using Template.Core.Common.Models;
using Template.Core.Entities;
using Template.Core.Features.Permissions;

namespace Template.Core.Features.Roles;

/// <summary>Handles role list queries.</summary>
public sealed class GetRolesHandler
{
    private readonly IRoleRepository _roleRepository;

    /// <summary>Creates a new handler.</summary>
    public GetRolesHandler(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    /// <summary>Returns a paged role list.</summary>
    public async Task<PagedResponse<RoleListItemDto>> HandleAsync(
        GetRolesQuery query,
        CancellationToken cancellationToken = default)
    {
        return await _roleRepository.GetPagedListAsync(query, cancellationToken);
    }
}

/// <summary>Handles role detail queries.</summary>
public sealed class GetRoleByIdHandler
{
    private readonly IRoleRepository _roleRepository;

    /// <summary>Creates a new handler.</summary>
    public GetRoleByIdHandler(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    /// <summary>Returns role details.</summary>
    public async Task<RoleDetailDto?> HandleAsync(
        GetRoleByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        var role = await _roleRepository.GetByIdWithPermissionsAsync(query.Id, cancellationToken);
        return role is null ? null : RoleHandlerMapper.ToDetail(role);
    }
}

/// <summary>Handles role creation.</summary>
public sealed class CreateRoleHandler
{
    private readonly IRoleRepository _roleRepository;
    private readonly IPermissionRepository _permissionRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public CreateRoleHandler(
        IRoleRepository roleRepository,
        IPermissionRepository permissionRepository,
        IUnitOfWork unitOfWork)
    {
        _roleRepository = roleRepository;
        _permissionRepository = permissionRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Creates a role and its permission links.</summary>
    public async Task<RoleDetailDto> HandleAsync(
        CreateRoleCommand command,
        CancellationToken cancellationToken = default)
    {
        await EnsureRoleNameIsUniqueAsync(command.Name, null, cancellationToken);
        var permissions = await ResolvePermissionsAsync(command.PermissionIds, cancellationToken);

        var role = new Role
        {
            Name = command.Name.Trim(),
            Description = command.Description?.Trim(),
            RolePermissions = permissions
                .Select(permission => new RolePermission { PermissionId = permission.Id })
                .ToList()
        };

        await _roleRepository.AddAsync(role, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var createdRole = await _roleRepository.GetByIdWithPermissionsAsync(role.Id, cancellationToken)
            ?? role;

        return RoleHandlerMapper.ToDetail(createdRole);
    }

    private async Task EnsureRoleNameIsUniqueAsync(string name, Guid? excludeId, CancellationToken cancellationToken)
    {
        var exists = await _roleRepository.ExistsByNameAsync(name, excludeId, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Role name already exists.");
        }
    }

    private async Task<IReadOnlyList<Permission>> ResolvePermissionsAsync(
        IReadOnlyCollection<Guid> permissionIds,
        CancellationToken cancellationToken)
    {
        var normalizedPermissionIds = permissionIds
            .Where(permissionId => permissionId != Guid.Empty)
            .Distinct()
            .ToArray();

        if (normalizedPermissionIds.Length == 0)
        {
            return [];
        }

        var permissions = await _permissionRepository.GetByIdsAsync(normalizedPermissionIds, cancellationToken);
        if (permissions.Count != normalizedPermissionIds.Length)
        {
            throw new InvalidOperationException("One or more permissions were not found.");
        }

        return permissions;
    }
}

/// <summary>Handles role updates.</summary>
public sealed class UpdateRoleHandler
{
    private readonly IRoleRepository _roleRepository;
    private readonly IPermissionRepository _permissionRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public UpdateRoleHandler(
        IRoleRepository roleRepository,
        IPermissionRepository permissionRepository,
        IUnitOfWork unitOfWork)
    {
        _roleRepository = roleRepository;
        _permissionRepository = permissionRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Updates a role and its permission links.</summary>
    public async Task<RoleDetailDto?> HandleAsync(
        Guid id,
        UpdateRoleCommand command,
        CancellationToken cancellationToken = default)
    {
        var role = await _roleRepository.GetTrackedByIdWithPermissionsAsync(id, cancellationToken);
        if (role is null)
        {
            return null;
        }

        await EnsureRoleNameIsUniqueAsync(command.Name, id, cancellationToken);
        var permissions = await ResolvePermissionsAsync(command.PermissionIds, cancellationToken);

        role.Name = command.Name.Trim();
        role.Description = command.Description?.Trim();
        role.RolePermissions.Clear();
        foreach (var permission in permissions)
        {
            role.RolePermissions.Add(new RolePermission { PermissionId = permission.Id });
        }

        _roleRepository.Update(role);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedRole = await _roleRepository.GetByIdWithPermissionsAsync(role.Id, cancellationToken)
            ?? role;

        return RoleHandlerMapper.ToDetail(updatedRole);
    }

    private async Task EnsureRoleNameIsUniqueAsync(string name, Guid? excludeId, CancellationToken cancellationToken)
    {
        var exists = await _roleRepository.ExistsByNameAsync(name, excludeId, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Role name already exists.");
        }
    }

    private async Task<IReadOnlyList<Permission>> ResolvePermissionsAsync(
        IReadOnlyCollection<Guid> permissionIds,
        CancellationToken cancellationToken)
    {
        var normalizedPermissionIds = permissionIds
            .Where(permissionId => permissionId != Guid.Empty)
            .Distinct()
            .ToArray();

        if (normalizedPermissionIds.Length == 0)
        {
            return [];
        }

        var permissions = await _permissionRepository.GetByIdsAsync(normalizedPermissionIds, cancellationToken);
        if (permissions.Count != normalizedPermissionIds.Length)
        {
            throw new InvalidOperationException("One or more permissions were not found.");
        }

        return permissions;
    }
}

/// <summary>Handles role deletion.</summary>
public sealed class DeleteRoleHandler
{
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new handler.</summary>
    public DeleteRoleHandler(IRoleRepository roleRepository, IUnitOfWork unitOfWork)
    {
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Deletes a role by identifier.</summary>
    public async Task<bool> HandleAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var role = await _roleRepository.GetTrackedByIdWithPermissionsAsync(id, cancellationToken);
        if (role is null)
        {
            return false;
        }

        _roleRepository.Delete(role);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}

/// <summary>Maps role entities to response DTOs.</summary>
internal static class RoleHandlerMapper
{
    /// <summary>Maps a role entity to a list item DTO.</summary>
    public static RoleListItemDto ToListItem(Role role)
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

    /// <summary>Maps a role entity to a detail DTO.</summary>
    public static RoleDetailDto ToDetail(Role role)
    {
        var permissionIds = role.RolePermissions
            .Select(rolePermission => rolePermission.PermissionId)
            .Distinct()
            .ToArray();

        var permissionKeys = role.RolePermissions
            .Select(rolePermission => rolePermission.Permission.Key)
            .Where(permissionKey => !string.IsNullOrWhiteSpace(permissionKey))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(permissionKey => permissionKey)
            .ToArray();

        return new RoleDetailDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            PermissionIds = permissionIds,
            PermissionKeys = permissionKeys
        };
    }
}
