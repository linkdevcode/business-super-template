namespace Template.Core.Common.Interfaces;

/// <summary>Defines the storage abstraction for file persistence.</summary>
public interface IStorageProvider
{
    /// <summary>Uploads a file stream and returns the generated storage key.</summary>
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken cancellationToken = default);

    /// <summary>Deletes a file by storage key.</summary>
    Task DeleteAsync(string storageKey, CancellationToken cancellationToken = default);

    /// <summary>Gets the public URL for a file by storage key.</summary>
    Task<string> GetUrlAsync(string storageKey, CancellationToken cancellationToken = default);
}
