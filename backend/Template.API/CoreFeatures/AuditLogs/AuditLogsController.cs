using Microsoft.AspNetCore.Mvc;
using Template.Core.Common.Constants;
using Template.Core.Common.Models;
using Template.Core.Features.AuditLogs;
using Template.Infrastructure.Auth;

namespace Template.API.CoreFeatures.AuditLogs;

/// <summary>Exposes audit log query endpoints.</summary>
[ApiController]
[Route("api/audit-logs")]
public sealed class AuditLogsController : ControllerBase
{
    private readonly GetAuditLogsHandler _getAuditLogsHandler;

    /// <summary>Creates a new controller.</summary>
    public AuditLogsController(GetAuditLogsHandler getAuditLogsHandler)
    {
        _getAuditLogsHandler = getAuditLogsHandler;
    }

    /// <summary>Gets a paged audit log list.</summary>
    [HttpGet]
    [HasPermission(PermissionKeys.AuditLog.Read)]
    public async Task<ActionResult<ApiResponse<AuditLogPageDto>>> GetAll(
        [FromQuery] GetAuditLogsQuery query,
        CancellationToken cancellationToken = default)
    {
        var result = await _getAuditLogsHandler.HandleAsync(query, cancellationToken);
        return Ok(ApiResponse<AuditLogPageDto>.Success(result));
    }
}
