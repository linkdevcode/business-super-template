using Microsoft.AspNetCore.Mvc;
using Template.Core.Common.Constants;
using Template.Core.Common.Models;
using Template.Core.Features.Permissions;
using Template.Infrastructure.Auth;

namespace Template.API.CoreFeatures.Permissions;

/// <summary>Exposes permission catalog endpoints.</summary>
[ApiController]
[Route("permissions")]
public sealed class PermissionsController : ControllerBase
{
    private readonly GetPermissionsHandler _getPermissionsHandler;

    /// <summary>Creates a new controller.</summary>
    public PermissionsController(GetPermissionsHandler getPermissionsHandler)
    {
        _getPermissionsHandler = getPermissionsHandler;
    }

    /// <summary>Gets the grouped permission catalog.</summary>
    [HttpGet]
    [HasPermission(PermissionKeys.Permission.Read)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<PermissionGroupDto>>>> GetAll(
        CancellationToken cancellationToken = default)
    {
        var result = await _getPermissionsHandler.HandleAsync(new GetPermissionsQuery(), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<PermissionGroupDto>>.Success(result));
    }
}
