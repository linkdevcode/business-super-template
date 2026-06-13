using Template.Core.Common.Models;

namespace Template.Core.Features.AuditLogs;

/// <summary>Handles audit log queries.</summary>
public sealed class GetAuditLogsHandler
{
    private readonly IAuditLogRepository _auditLogRepository;

    /// <summary>Creates a new handler.</summary>
    public GetAuditLogsHandler(IAuditLogRepository auditLogRepository)
    {
        _auditLogRepository = auditLogRepository;
    }

    /// <summary>Returns a paged audit log list.</summary>
    public async Task<AuditLogPageDto> HandleAsync(
        GetAuditLogsQuery query,
        CancellationToken cancellationToken = default)
    {
        return await _auditLogRepository.GetPagedListAsync(query, cancellationToken);
    }
}
