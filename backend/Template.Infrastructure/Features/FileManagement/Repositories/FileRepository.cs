using Microsoft.EntityFrameworkCore;
using FileEntity = Template.Core.Entities.File;
using Template.Core.Features.FileManagement;
using Template.Infrastructure.Persistence;
using Template.Infrastructure.Persistence.Repositories;

namespace Template.Infrastructure.Features.FileManagement.Repositories;

/// <summary>EF Core file repository.</summary>
public sealed class FileRepository : BaseRepository<FileEntity>, IFileRepository
{
    private readonly AppDbContext _dbContext;

    /// <summary>Creates a new repository.</summary>
    public FileRepository(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public Task<FileEntity?> GetTrackedByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Files.FirstOrDefaultAsync(file => file.Id == id, cancellationToken);
    }

}
