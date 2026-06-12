using System.Linq.Expressions;
using Template.Core.Common.Models;

namespace Template.Core.Common.Interfaces;

/// <summary>Defines common repository operations for aggregate roots.</summary>
public interface IBaseRepository<TEntity>
    where TEntity : BaseEntity
{
    /// <summary>Gets a single entity by identifier.</summary>
    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Gets all entities using read-only tracking behavior.</summary>
    Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>Gets a paged entity result using optional filtering and sorting.</summary>
    Task<PagedResponse<TEntity>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        Expression<Func<TEntity, bool>>? predicate = null,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default);

    /// <summary>Adds a new entity to the current unit of work.</summary>
    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    /// <summary>Marks the entity as modified in the current unit of work.</summary>
    void Update(TEntity entity);

    /// <summary>Marks the entity as deleted in the current unit of work.</summary>
    void Delete(TEntity entity);
}
