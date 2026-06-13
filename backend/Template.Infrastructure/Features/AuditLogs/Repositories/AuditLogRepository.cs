using Microsoft.EntityFrameworkCore;
using Template.Core.Common.Models;
using Template.Core.Features.AuditLogs;
using Template.Infrastructure.Persistence;

namespace Template.Infrastructure.Features.AuditLogs.Repositories;

/// <summary>EF Core audit log repository.</summary>
public sealed class AuditLogRepository : IAuditLogRepository
{
    private readonly AppDbContext _dbContext;

    /// <summary>Creates a new repository.</summary>
    public AuditLogRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public async Task<AuditLogPageDto> GetPagedListAsync(
        GetAuditLogsQuery query,
        CancellationToken cancellationToken = default)
    {
        IQueryable<AuditLog> auditLogs = _dbContext.AuditLogs
            .AsNoTracking();

        auditLogs = ApplyFilters(auditLogs, query);

        var totalRecords = await auditLogs.CountAsync(cancellationToken);
        var pageNumber = Math.Max(query.PageNumber, 1);
        var pageSize = Math.Max(query.PageSize, 1);

        var items = await auditLogs
            .OrderByDescending(entry => entry.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(entry => new AuditLogListItemDto
            {
                Id = entry.Id,
                TableName = entry.EntityType,
                RecordId = entry.EntityId,
                Action = entry.Action,
                UserId = entry.CreatedBy,
                Changes = entry.Changes,
                CreatedAt = entry.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return AuditLogPageDto.Create(items, pageNumber, pageSize, totalRecords);
    }

    private static IQueryable<AuditLog> ApplyFilters(
        IQueryable<AuditLog> query,
        GetAuditLogsQuery filters)
    {
        if (!string.IsNullOrWhiteSpace(filters.TableName))
        {
            var normalizedTableName = filters.TableName.Trim();
            query = query.Where(entry => entry.EntityType == normalizedTableName);
        }

        if (filters.UserId.HasValue && filters.UserId.Value != Guid.Empty)
        {
            var userId = filters.UserId.Value;
            query = query.Where(entry => entry.CreatedBy == userId);
        }

        if (!string.IsNullOrWhiteSpace(filters.Action))
        {
            var normalizedAction = NormalizeAction(filters.Action);
            query = query.Where(entry => entry.Action == normalizedAction);
        }

        return query;
    }

    private static string NormalizeAction(string action)
    {
        return action.Trim().ToUpperInvariant() switch
        {
            "CREATE" => AuditLogActions.Create,
            "UPDATE" => AuditLogActions.Update,
            "DELETE" => AuditLogActions.Delete,
            _ => action.Trim().ToUpperInvariant()
        };
    }
}
