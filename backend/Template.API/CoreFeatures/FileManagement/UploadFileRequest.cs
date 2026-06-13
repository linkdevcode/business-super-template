namespace Template.API.CoreFeatures.FileManagement;

/// <summary>Represents a multipart file upload request.</summary>
public sealed class UploadFileRequest
{
    /// <summary>Gets or sets the uploaded file.</summary>
    public IFormFile? File { get; set; }
}
