using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Template.Core.Common.Constants;
using Template.Core.Common.Models;
using Template.Core.Features.FileManagement;
using Template.Infrastructure.Auth;

namespace Template.API.CoreFeatures.FileManagement;

/// <summary>Exposes file management endpoints.</summary>
[ApiController]
[Route("api/files")]
public sealed class FilesController : ControllerBase
{
    private readonly UploadFileHandler _uploadFileHandler;
    private readonly GetFileHandler _getFileHandler;
    private readonly DeleteFileHandler _deleteFileHandler;

    /// <summary>Creates a new files controller.</summary>
    public FilesController(
        UploadFileHandler uploadFileHandler,
        GetFileHandler getFileHandler,
        DeleteFileHandler deleteFileHandler)
    {
        _uploadFileHandler = uploadFileHandler;
        _getFileHandler = getFileHandler;
        _deleteFileHandler = deleteFileHandler;
    }

    /// <summary>Gets a file metadata record by identifier.</summary>
    [HttpGet("{id:guid}")]
    [HasPermission(PermissionKeys.File.Read)]
    public async Task<ActionResult<ApiResponse<FileDto>>> GetById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var result = await _getFileHandler.HandleAsync(new GetFileQuery { Id = id }, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<FileDto>.Failure("File not found."));
        }

        return Ok(ApiResponse<FileDto>.Success(result));
    }

    /// <summary>Uploads a new file.</summary>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [HasPermission(PermissionKeys.File.Create)]
    public async Task<ActionResult<ApiResponse<FileDto>>> Upload(
        [FromForm] UploadFileRequest request,
        CancellationToken cancellationToken = default)
    {
        var file = request.File;
        if (file is null || file.Length <= 0)
        {
            return BadRequest(ApiResponse<FileDto>.Failure("File is required."));
        }

        var currentUserId = GetCurrentUserId();
        using var stream = file.OpenReadStream();

        var result = await _uploadFileHandler.HandleAsync(
            new UploadFileCommand
            {
                ContentStream = stream,
                FileName = file.FileName,
                ContentType = string.IsNullOrWhiteSpace(file.ContentType) ? "application/octet-stream" : file.ContentType,
                FileSize = file.Length,
                UploadedById = currentUserId
            },
            cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            ApiResponse<FileDto>.Success(result, "File uploaded successfully."));
    }

    /// <summary>Soft-deletes a file and removes the blob from storage.</summary>
    [HttpDelete("{id:guid}")]
    [HasPermission(PermissionKeys.File.Delete)]
    public async Task<ActionResult<ApiResponse<object>>> Delete(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var deleted = await _deleteFileHandler.HandleAsync(new DeleteFileCommand { Id = id }, cancellationToken);
        if (!deleted)
        {
            return NotFound(ApiResponse<object>.Failure("File not found."));
        }

        return Ok(ApiResponse<object>.Success(message: "File deleted successfully."));
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
