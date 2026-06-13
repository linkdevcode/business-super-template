using System.Text.Json;
using FluentValidation;
using Template.Core.Common.Interfaces;
using Template.Core.Entities;

namespace Template.Core.Features.SystemSettings;

/// <summary>Handles system settings queries and saves.</summary>
public sealed class GetSystemSettingsHandler
{
    private readonly ISystemSettingRepository _systemSettingRepository;

    /// <summary>Creates a new handler.</summary>
    public GetSystemSettingsHandler(ISystemSettingRepository systemSettingRepository)
    {
        _systemSettingRepository = systemSettingRepository;
    }

    /// <summary>Loads the current system settings payload.</summary>
    public async Task<SystemSettingDto> HandleAsync(
        GetSystemSettingsQuery query,
        CancellationToken cancellationToken = default)
    {
        var key = NormalizeKey(query.Key);
        var setting = await _systemSettingRepository.GetByKeyAsync(key, cancellationToken);

        return setting is null
            ? new SystemSettingDto
            {
                Key = key,
                Group = "system",
                Description = "System configuration",
                Value = new SystemSettingsPayload()
            }
            : SystemSettingsMapper.ToDto(setting);
    }

    private static string NormalizeKey(string? key)
    {
        return string.IsNullOrWhiteSpace(key) ? "default" : key.Trim();
    }
}

/// <summary>Handles system settings persistence.</summary>
public sealed class SaveSystemSettingsHandler
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly ISystemSettingRepository _systemSettingRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<SaveSystemSettingsCommand> _validator;

    /// <summary>Creates a new handler.</summary>
    public SaveSystemSettingsHandler(
        ISystemSettingRepository systemSettingRepository,
        IUnitOfWork unitOfWork,
        IValidator<SaveSystemSettingsCommand> validator)
    {
        _systemSettingRepository = systemSettingRepository;
        _unitOfWork = unitOfWork;
        _validator = validator;
    }

    /// <summary>Validates and persists the current system settings payload.</summary>
    public async Task<SystemSettingDto> HandleAsync(
        SaveSystemSettingsCommand command,
        CancellationToken cancellationToken = default)
    {
        await _validator.ValidateAndThrowAsync(command, cancellationToken);

        var key = NormalizeKey(command.Key);
        var setting = await _systemSettingRepository.GetTrackedByKeyAsync(key, cancellationToken);
        var isNew = setting is null;
        setting ??= new SystemSetting();

        setting.Key = key;
        setting.Group = NormalizeText(command.Group, "system");
        setting.Description = NormalizeText(command.Description, "System configuration");
        setting.Value = JsonSerializer.Serialize(command.Value, JsonOptions);
        setting.UpdatedBy = string.IsNullOrWhiteSpace(command.UpdatedBy)
            ? null
            : command.UpdatedBy.Trim();

        if (isNew)
        {
            await _systemSettingRepository.AddAsync(setting, cancellationToken);
        }
        else
        {
            _systemSettingRepository.Update(setting);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return SystemSettingsMapper.ToDto(setting);
    }

    private static string NormalizeKey(string? key)
    {
        return string.IsNullOrWhiteSpace(key) ? "default" : key.Trim();
    }

    private static string NormalizeText(string? value, string fallback)
    {
        return string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();
    }
}

internal static class SystemSettingsMapper
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    public static SystemSettingDto ToDto(SystemSetting setting)
    {
        return new SystemSettingDto
        {
            Id = setting.Id,
            Key = setting.Key,
            Group = setting.Group,
            Description = setting.Description,
            Value = DeserializePayload(setting.Value),
            UpdatedBy = setting.UpdatedBy,
            CreatedAt = setting.CreatedAt,
            UpdatedAt = setting.UpdatedAt
        };
    }

    private static SystemSettingsPayload DeserializePayload(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return new SystemSettingsPayload();
        }

        try
        {
            return JsonSerializer.Deserialize<SystemSettingsPayload>(value, JsonOptions)
                ?? new SystemSettingsPayload();
        }
        catch (JsonException)
        {
            return new SystemSettingsPayload();
        }
    }
}
