using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Template.Core.Common.Constants;
using Template.Core.Common.Models;
using Template.Core.Features.SystemSettings;
using Template.Infrastructure.Auth;

namespace Template.API.CoreFeatures.SystemSettings;

/// <summary>Exposes system settings endpoints.</summary>
[ApiController]
[Route("api/system-settings")]
public sealed class SystemSettingsController : ControllerBase
{
    private readonly GetSystemSettingsHandler _getSystemSettingsHandler;
    private readonly SaveSystemSettingsHandler _saveSystemSettingsHandler;

    /// <summary>Creates a new controller.</summary>
    public SystemSettingsController(
        GetSystemSettingsHandler getSystemSettingsHandler,
        SaveSystemSettingsHandler saveSystemSettingsHandler)
    {
        _getSystemSettingsHandler = getSystemSettingsHandler;
        _saveSystemSettingsHandler = saveSystemSettingsHandler;
    }

    /// <summary>Gets the current system settings payload.</summary>
    [HttpGet]
    [HasPermission(PermissionKeys.SystemSetting.Read)]
    public async Task<ActionResult<ApiResponse<SystemSettingDto>>> Get(
        [FromQuery] GetSystemSettingsQuery query,
        CancellationToken cancellationToken = default)
    {
        var result = await _getSystemSettingsHandler.HandleAsync(query, cancellationToken);
        return Ok(ApiResponse<SystemSettingDto>.Success(result));
    }

    /// <summary>Saves the current system settings payload.</summary>
    [HttpPut]
    [HasPermission(PermissionKeys.SystemSetting.Update)]
    public async Task<ActionResult<ApiResponse<SystemSettingDto>>> Save(
        [FromBody] SaveSystemSettingsCommand command,
        CancellationToken cancellationToken = default)
    {
        command.UpdatedBy = GetCurrentUserId().ToString();
        var result = await _saveSystemSettingsHandler.HandleAsync(command, cancellationToken);
        return Ok(ApiResponse<SystemSettingDto>.Success(result, "System settings saved successfully."));
    }

    private Guid GetCurrentUserId()
    {
        var subject = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(subject, out var userId))
        {
            throw new UnauthorizedAccessException("Current user is missing.");
        }

        return userId;
    }
}
