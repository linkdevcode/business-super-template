using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Template.Core.Common.Interfaces;
using Template.Core.Common.Models;

namespace Template.Infrastructure.Persistence.Repositories;

/// <summary>Base repository for EF Core persistence operations.</summary>
public class BaseRepository<TEntity> : IBaseRepository<TEntity>
    where TEntity : BaseEntity
{
    private readonly AppDbContext _dbContext;
    private readonly DbSet<TEntity> _entities;

    public BaseRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
        _entities = _dbContext.Set<TEntity>();
    }

    /// <inheritdoc />
    public async Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _entities
            .AsNoTracking()
            .FirstOrDefaultAsync(entity => entity.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _entities
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<PagedResponse<TEntity>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        Expression<Func<TEntity, bool>>? predicate = null,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var query = _entities.AsNoTracking().AsQueryable();

        if (predicate is not null)
        {
            query = query.Where(predicate);
        }

        var totalRecords = await query.CountAsync(cancellationToken);
        var orderedQuery = ApplyOrdering(query, sortBy, sortDescending);
        var items = await orderedQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return PagedResponse<TEntity>.Create(items, pageNumber, pageSize, totalRecords);
    }

    /// <inheritdoc />
    public async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        await _entities.AddAsync(entity, cancellationToken);
    }

    /// <inheritdoc />
    public void Update(TEntity entity)
    {
        _entities.Update(entity);
    }

    /// <inheritdoc />
    public void Delete(TEntity entity)
    {
        _entities.Remove(entity);
    }

    private static IQueryable<TEntity> ApplyOrdering(
        IQueryable<TEntity> query,
        string? sortBy,
        bool sortDescending)
    {
        var sortProperty = string.IsNullOrWhiteSpace(sortBy)
            ? nameof(BaseEntity.CreatedAt)
            : sortBy;

        return sortDescending
            ? query.OrderByDescending(entity => EF.Property<object>(entity, sortProperty))
            : query.OrderBy(entity => EF.Property<object>(entity, sortProperty));
    }
}
