namespace Template.Core.Common.Interfaces;

/// <summary>Coordinates persistence operations across repositories.</summary>
public interface IUnitOfWork
{
    /// <summary>Persists pending changes to the data store.</summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
