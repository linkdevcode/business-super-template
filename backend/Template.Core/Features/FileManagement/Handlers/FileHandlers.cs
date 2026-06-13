using Template.Core.Common.Interfaces;
using FileEntity = Template.Core.Entities.File;

namespace Template.Core.Features.FileManagement;

/// <summary>Handles file upload use cases.</summary>
public sealed class UploadFileHandler
{
    private readonly IFileRepository _fileRepository;
    private readonly IStorageProvider _storageProvider;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new upload handler.</summary>
    public UploadFileHandler(
        IFileRepository fileRepository,
        IStorageProvider storageProvider,
        IUnitOfWork unitOfWork)
    {
        _fileRepository = fileRepository;
        _storageProvider = storageProvider;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Uploads a new file and persists the metadata record.</summary>
    public async Task<FileDto> HandleAsync(UploadFileCommand command, CancellationToken cancellationToken = default)
    {
        ValidateCommand(command);

        var safeFileName = Path.GetFileName(command.FileName);
        var storageKey = BuildStorageKey(safeFileName);
        var uploadedFile = await UploadToStorageAsync(command, storageKey, cancellationToken);

        var file = new FileEntity
        {
            FileName = safeFileName,
            StorageKey = storageKey,
            ContentType = NormalizeContentType(command.ContentType),
            FileSize = command.FileSize,
            Url = uploadedFile.Url,
            UploadedById = command.UploadedById
        };

        try
        {
            await _fileRepository.AddAsync(file, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            await SafeDeleteStorageAsync(storageKey, cancellationToken);
            throw;
        }

        return ToDto(file);
    }

    private async Task<UploadedStorageFile> UploadToStorageAsync(
        UploadFileCommand command,
        string storageKey,
        CancellationToken cancellationToken)
    {
        using var contentStream = command.ContentStream;
        var finalStorageKey = await _storageProvider.UploadAsync(
            contentStream,
            storageKey,
            command.ContentType,
            cancellationToken);

        var url = await _storageProvider.GetUrlAsync(finalStorageKey, cancellationToken);
        return new UploadedStorageFile(finalStorageKey, url);
    }

    private async Task SafeDeleteStorageAsync(string storageKey, CancellationToken cancellationToken)
    {
        try
        {
            await _storageProvider.DeleteAsync(storageKey, cancellationToken);
        }
        catch
        {
            // Best-effort compensation; persistence failure should still surface.
        }
    }

    private static void ValidateCommand(UploadFileCommand command)
    {
        if (command.ContentStream is null || command.ContentStream == Stream.Null)
        {
            throw new ArgumentException("File content is required.");
        }

        if (string.IsNullOrWhiteSpace(command.FileName))
        {
            throw new ArgumentException("File name is required.");
        }

        if (string.IsNullOrWhiteSpace(command.ContentType))
        {
            throw new ArgumentException("Content type is required.");
        }

        if (command.FileSize <= 0)
        {
            throw new ArgumentException("File size must be greater than zero.");
        }

        if (command.UploadedById == Guid.Empty)
        {
            throw new ArgumentException("Uploaded by user is required.");
        }
    }

    private static string BuildStorageKey(string fileName)
    {
        var extension = Path.GetExtension(fileName);
        return $"files/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}{extension}";
    }

    private static string NormalizeContentType(string contentType)
    {
        return contentType.Trim();
    }

    private static FileDto ToDto(FileEntity file)
    {
        return new FileDto
        {
            Id = file.Id,
            FileName = file.FileName,
            StorageKey = file.StorageKey,
            ContentType = file.ContentType,
            FileSize = file.FileSize,
            Url = file.Url,
            UploadedById = file.UploadedById,
            CreatedAt = file.CreatedAt,
            UpdatedAt = file.UpdatedAt
        };
    }

    private sealed record UploadedStorageFile(string StorageKey, string Url);
}

/// <summary>Handles file lookup use cases.</summary>
public sealed class GetFileHandler
{
    private readonly IFileRepository _fileRepository;

    /// <summary>Creates a new file lookup handler.</summary>
    public GetFileHandler(IFileRepository fileRepository)
    {
        _fileRepository = fileRepository;
    }

    /// <summary>Loads a file metadata record by identifier.</summary>
    public async Task<FileDto?> HandleAsync(GetFileQuery query, CancellationToken cancellationToken = default)
    {
        var file = await _fileRepository.GetByIdAsync(query.Id, cancellationToken);
        return file is null ? null : ToDto(file);
    }

    private static FileDto ToDto(FileEntity file)
    {
        return new FileDto
        {
            Id = file.Id,
            FileName = file.FileName,
            StorageKey = file.StorageKey,
            ContentType = file.ContentType,
            FileSize = file.FileSize,
            Url = file.Url,
            UploadedById = file.UploadedById,
            CreatedAt = file.CreatedAt,
            UpdatedAt = file.UpdatedAt
        };
    }
}

/// <summary>Handles file deletion use cases.</summary>
public sealed class DeleteFileHandler
{
    private readonly IFileRepository _fileRepository;
    private readonly IStorageProvider _storageProvider;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates a new file deletion handler.</summary>
    public DeleteFileHandler(
        IFileRepository fileRepository,
        IStorageProvider storageProvider,
        IUnitOfWork unitOfWork)
    {
        _fileRepository = fileRepository;
        _storageProvider = storageProvider;
        _unitOfWork = unitOfWork;
    }

    /// <summary>Soft-deletes the file metadata and removes the object from storage.</summary>
    public async Task<bool> HandleAsync(DeleteFileCommand command, CancellationToken cancellationToken = default)
    {
        var file = await _fileRepository.GetTrackedByIdAsync(command.Id, cancellationToken);
        if (file is null)
        {
            return false;
        }

        await _storageProvider.DeleteAsync(file.StorageKey, cancellationToken);
        _fileRepository.Delete(file);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
