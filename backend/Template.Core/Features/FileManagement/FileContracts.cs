namespace Template.Core.Features.FileManagement;

/// <summary>Represents a file upload request.</summary>
public sealed class UploadFileCommand
{
    /// <summary>Gets or sets the file stream.</summary>
    public Stream ContentStream { get; set; } = Stream.Null;

    /// <summary>Gets or sets the original file name.</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>Gets or sets the MIME content type.</summary>
    public string ContentType { get; set; } = string.Empty;

    /// <summary>Gets or sets the file size in bytes.</summary>
    public long FileSize { get; set; }

    /// <summary>Gets or sets the identifier of the uploading user.</summary>
    public Guid UploadedById { get; set; }
}

/// <summary>Represents a file deletion request.</summary>
public sealed class DeleteFileCommand
{
    /// <summary>Gets or sets the file identifier.</summary>
    public Guid Id { get; set; }
}

/// <summary>Represents a file lookup request.</summary>
public sealed class GetFileQuery
{
    /// <summary>Gets or sets the file identifier.</summary>
    public Guid Id { get; set; }
}

/// <summary>Represents a file metadata payload.</summary>
public sealed class FileDto
{
    /// <summary>Gets or sets the file identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the original file name.</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>Gets or sets the storage key.</summary>
    public string StorageKey { get; set; } = string.Empty;

    /// <summary>Gets or sets the MIME content type.</summary>
    public string ContentType { get; set; } = string.Empty;

    /// <summary>Gets or sets the file size in bytes.</summary>
    public long FileSize { get; set; }

    /// <summary>Gets or sets the file URL.</summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>Gets or sets the uploader identifier.</summary>
    public Guid UploadedById { get; set; }

    /// <summary>Gets or sets the creation time.</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Gets or sets the last update time.</summary>
    public DateTime UpdatedAt { get; set; }
}
