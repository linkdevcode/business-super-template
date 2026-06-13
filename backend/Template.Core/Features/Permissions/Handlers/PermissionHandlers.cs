namespace Template.Core.Features.Permissions;

/// <summary>Handles permission catalog queries.</summary>
public sealed class GetPermissionsHandler
{
    private readonly IPermissionRepository _permissionRepository;

    /// <summary>Creates a new handler.</summary>
    public GetPermissionsHandler(IPermissionRepository permissionRepository)
    {
        _permissionRepository = permissionRepository;
    }

    /// <summary>Returns the grouped permission catalog.</summary>
    public async Task<IReadOnlyList<PermissionGroupDto>> HandleAsync(
        GetPermissionsQuery query,
        CancellationToken cancellationToken = default)
    {
        return await _permissionRepository.GetGroupedAsync(cancellationToken);
    }
}
