namespace Template.Core.Features.AuditLogs;

/// <summary>Defines audit log query operations.</summary>
public interface IAuditLogRepository
{
    /// <summary>Gets a paged audit log list using read-only tracking behavior.</summary>
    Task<AuditLogPageDto> GetPagedListAsync(
        GetAuditLogsQuery query,
        CancellationToken cancellationToken = default);
}
