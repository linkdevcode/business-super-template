using Microsoft.AspNetCore.Mvc;
using Template.Core.Common.Constants;
using Template.Core.Common.Models;
using Template.Core.Features.Roles;
using Template.Infrastructure.Auth;

namespace Template.API.CoreFeatures.Roles;

/// <summary>Exposes role CRUD endpoints.</summary>
[ApiController]
[Route("roles")]
public sealed class RolesController : ControllerBase
{
    private readonly GetRolesHandler _getRolesHandler;
    private readonly GetRoleByIdHandler _getRoleByIdHandler;
    private readonly CreateRoleHandler _createRoleHandler;
    private readonly UpdateRoleHandler _updateRoleHandler;
    private readonly DeleteRoleHandler _deleteRoleHandler;

    /// <summary>Creates a new controller.</summary>
    public RolesController(
        GetRolesHandler getRolesHandler,
        GetRoleByIdHandler getRoleByIdHandler,
        CreateRoleHandler createRoleHandler,
        UpdateRoleHandler updateRoleHandler,
        DeleteRoleHandler deleteRoleHandler)
    {
        _getRolesHandler = getRolesHandler;
        _getRoleByIdHandler = getRoleByIdHandler;
        _createRoleHandler = createRoleHandler;
        _updateRoleHandler = updateRoleHandler;
        _deleteRoleHandler = deleteRoleHandler;
    }

    /// <summary>Gets a paged role list.</summary>
    [HttpGet]
    [HasPermission(PermissionKeys.Role.Read)]
    public async Task<ActionResult<ApiResponse<PagedResponse<RoleListItemDto>>>> GetAll(
        [FromQuery] GetRolesQuery query,
        CancellationToken cancellationToken = default)
    {
        var result = await _getRolesHandler.HandleAsync(query, cancellationToken);
        return Ok(ApiResponse<PagedResponse<RoleListItemDto>>.Success(result));
    }

    /// <summary>Gets a single role by identifier.</summary>
    [HttpGet("{id:guid}")]
    [HasPermission(PermissionKeys.Role.Read)]
    public async Task<ActionResult<ApiResponse<RoleDetailDto>>> GetById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var result = await _getRoleByIdHandler.HandleAsync(new GetRoleByIdQuery { Id = id }, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<RoleDetailDto>.Failure("Role not found."));
        }

        return Ok(ApiResponse<RoleDetailDto>.Success(result));
    }

    /// <summary>Creates a new role.</summary>
    [HttpPost]
    [HasPermission(PermissionKeys.Role.Create)]
    public async Task<ActionResult<ApiResponse<RoleDetailDto>>> Create(
        [FromBody] CreateRoleCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _createRoleHandler.HandleAsync(command, cancellationToken);
        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            ApiResponse<RoleDetailDto>.Success(result, "Role created successfully."));
    }

    /// <summary>Updates an existing role.</summary>
    [HttpPut("{id:guid}")]
    [HasPermission(PermissionKeys.Role.Update)]
    public async Task<ActionResult<ApiResponse<RoleDetailDto>>> Update(
        Guid id,
        [FromBody] UpdateRoleCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _updateRoleHandler.HandleAsync(id, command, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<RoleDetailDto>.Failure("Role not found."));
        }

        return Ok(ApiResponse<RoleDetailDto>.Success(result, "Role updated successfully."));
    }

    /// <summary>Deletes a role.</summary>
    [HttpDelete("{id:guid}")]
    [HasPermission(PermissionKeys.Role.Delete)]
    public async Task<ActionResult<ApiResponse<object>>> Delete(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var deleted = await _deleteRoleHandler.HandleAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound(ApiResponse<object>.Failure("Role not found."));
        }

        return Ok(ApiResponse<object>.Success(message: "Role deleted successfully."));
    }
}
