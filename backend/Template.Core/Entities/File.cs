using Template.Core.Common.Models;

namespace Template.Core.Entities;

/// <summary>Represents file metadata stored in the application database.</summary>
public class File : BaseEntity
{
    /// <summary>Gets or sets the original file name.</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>Gets or sets the storage key used by the backing storage provider.</summary>
    public string StorageKey { get; set; } = string.Empty;

    /// <summary>Gets or sets the MIME content type.</summary>
    public string ContentType { get; set; } = string.Empty;

    /// <summary>Gets or sets the file size in bytes.</summary>
    public long FileSize { get; set; }

    /// <summary>Gets or sets the publicly accessible file URL.</summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>Gets or sets the identifier of the user who uploaded the file.</summary>
    public Guid UploadedById { get; set; }

    /// <summary>Gets or sets the user who uploaded the file.</summary>
    public User? UploadedBy { get; set; }
}
