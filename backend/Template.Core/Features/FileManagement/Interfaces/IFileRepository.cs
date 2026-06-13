using FileEntity = Template.Core.Entities.File;

namespace Template.Core.Features.FileManagement;

/// <summary>Defines file persistence operations.</summary>
public interface IFileRepository
{
    /// <summary>Gets a file by identifier using read-only tracking behavior.</summary>
    Task<FileEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Gets a tracked file by identifier for updates or soft delete.</summary>
    Task<FileEntity?> GetTrackedByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Adds a new file entity to the current unit of work.</summary>
    Task AddAsync(FileEntity entity, CancellationToken cancellationToken = default);

    /// <summary>Marks an existing file entity as modified.</summary>
    void Update(FileEntity entity);

    /// <summary>Marks an existing file entity as deleted.</summary>
    void Delete(FileEntity entity);
}
