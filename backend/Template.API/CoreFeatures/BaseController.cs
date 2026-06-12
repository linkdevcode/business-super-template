using Microsoft.AspNetCore.Mvc;
using Template.Core.Common.Models;

namespace Template.API.CoreFeatures;

/// <summary>Base controller with standard CRUD endpoints and response wrappers.</summary>
[ApiController]
public abstract class BaseController<TEntity> : ControllerBase
    where TEntity : BaseEntity
{
    /// <summary>Gets a paged list of entities.</summary>
    [HttpGet]
    public virtual async Task<ActionResult<ApiResponse<PagedResponse<TEntity>>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var result = await GetAllAsync(
            pageNumber,
            pageSize,
            searchTerm,
            sortBy,
            sortDescending,
            cancellationToken);

        return Ok(ApiResponse<PagedResponse<TEntity>>.Success(result));
    }

    /// <summary>Gets a single entity by identifier.</summary>
    [HttpGet("{id:guid}")]
    public virtual async Task<ActionResult<ApiResponse<TEntity>>> GetById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id, cancellationToken);

        if (entity is null)
        {
            return NotFound(ApiResponse<TEntity>.Failure("Resource not found."));
        }

        return Ok(ApiResponse<TEntity>.Success(entity));
    }

    /// <summary>Creates a new entity.</summary>
    [HttpPost]
    public virtual async Task<ActionResult<ApiResponse<TEntity>>> Create(
        [FromBody] TEntity request,
        CancellationToken cancellationToken = default)
    {
        var created = await CreateAsync(request, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            ApiResponse<TEntity>.Success(created, "Created successfully."));
    }

    /// <summary>Updates an existing entity.</summary>
    [HttpPut("{id:guid}")]
    public virtual async Task<ActionResult<ApiResponse<TEntity>>> Update(
        Guid id,
        [FromBody] TEntity request,
        CancellationToken cancellationToken = default)
    {
        var updated = await UpdateAsync(id, request, cancellationToken);

        if (updated is null)
        {
            return NotFound(ApiResponse<TEntity>.Failure("Resource not found."));
        }

        return Ok(ApiResponse<TEntity>.Success(updated, "Updated successfully."));
    }

    /// <summary>Deletes an entity by identifier.</summary>
    [HttpDelete("{id:guid}")]
    public virtual async Task<ActionResult<ApiResponse<object>>> Delete(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var deleted = await DeleteAsync(id, cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResponse<object>.Failure("Resource not found."));
        }

        return Ok(ApiResponse<object>.Success(message: "Deleted successfully."));
    }

    /// <summary>Gets a paged list of entities for the current controller.</summary>
    protected abstract Task<PagedResponse<TEntity>> GetAllAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm,
        string? sortBy,
        bool sortDescending,
        CancellationToken cancellationToken);

    /// <summary>Gets a single entity by identifier for the current controller.</summary>
    protected abstract Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    /// <summary>Creates a new entity for the current controller.</summary>
    protected abstract Task<TEntity> CreateAsync(TEntity request, CancellationToken cancellationToken);

    /// <summary>Updates an existing entity for the current controller.</summary>
    protected abstract Task<TEntity?> UpdateAsync(Guid id, TEntity request, CancellationToken cancellationToken);

    /// <summary>Deletes an entity for the current controller.</summary>
    protected abstract Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
