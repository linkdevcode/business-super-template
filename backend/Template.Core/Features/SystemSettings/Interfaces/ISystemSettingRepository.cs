using Template.Core.Entities;

namespace Template.Core.Features.SystemSettings;

/// <summary>Defines system settings persistence operations.</summary>
public interface ISystemSettingRepository
{
    /// <summary>Gets a system setting by key using read-only tracking behavior.</summary>
    Task<SystemSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);

    /// <summary>Gets a tracked system setting by key for updates.</summary>
    Task<SystemSetting?> GetTrackedByKeyAsync(string key, CancellationToken cancellationToken = default);

    /// <summary>Adds a system setting to the current unit of work.</summary>
    Task AddAsync(SystemSetting entity, CancellationToken cancellationToken = default);

    /// <summary>Marks a system setting as modified in the current unit of work.</summary>
    void Update(SystemSetting entity);
}
