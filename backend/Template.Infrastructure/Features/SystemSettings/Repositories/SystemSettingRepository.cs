using Microsoft.EntityFrameworkCore;
using Template.Core.Entities;
using Template.Core.Features.SystemSettings;
using Template.Infrastructure.Persistence;

namespace Template.Infrastructure.Features.SystemSettings.Repositories;

/// <summary>EF Core system setting repository.</summary>
public sealed class SystemSettingRepository : ISystemSettingRepository
{
    private readonly AppDbContext _dbContext;

    /// <summary>Creates a new repository.</summary>
    public SystemSettingRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public Task<SystemSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        var normalizedKey = key.Trim();
        return _dbContext.SystemSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(setting => setting.Key == normalizedKey, cancellationToken);
    }

    /// <inheritdoc />
    public Task<SystemSetting?> GetTrackedByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        var normalizedKey = key.Trim();
        return _dbContext.SystemSettings
            .FirstOrDefaultAsync(setting => setting.Key == normalizedKey, cancellationToken);
    }

    /// <inheritdoc />
    public async Task AddAsync(SystemSetting entity, CancellationToken cancellationToken = default)
    {
        await _dbContext.SystemSettings.AddAsync(entity, cancellationToken);
    }

    /// <inheritdoc />
    public void Update(SystemSetting entity)
    {
        _dbContext.SystemSettings.Update(entity);
    }
}
