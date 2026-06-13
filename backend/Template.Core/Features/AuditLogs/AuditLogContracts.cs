using Template.Core.Common.Models;

namespace Template.Core.Features.AuditLogs;

/// <summary>Supported audit log actions.</summary>
public static class AuditLogActions
{
    /// <summary>Create action.</summary>
    public const string Create = "CREATE";

    /// <summary>Update action.</summary>
    public const string Update = "UPDATE";

    /// <summary>Delete action.</summary>
    public const string Delete = "DELETE";
}

/// <summary>Represents an audit log list request.</summary>
public sealed class GetAuditLogsQuery
{
    /// <summary>Gets or sets the current page number.</summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>Gets or sets the current page size.</summary>
    public int PageSize { get; set; } = 10;

    /// <summary>Gets or sets the optional table name filter.</summary>
    public string? TableName { get; set; }

    /// <summary>Gets or sets the optional actor user identifier filter.</summary>
    public Guid? UserId { get; set; }

    /// <summary>Gets or sets the optional action filter.</summary>
    public string? Action { get; set; }
}

/// <summary>Represents an audit log list item.</summary>
public sealed class AuditLogListItemDto
{
    /// <summary>Gets or sets the log identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the affected table or entity type.</summary>
    public string TableName { get; set; } = string.Empty;

    /// <summary>Gets or sets the affected record identifier.</summary>
    public Guid RecordId { get; set; }

    /// <summary>Gets or sets the action name.</summary>
    public string Action { get; set; } = string.Empty;

    /// <summary>Gets or sets the identifier of the user who created the log.</summary>
    public Guid? UserId { get; set; }

    /// <summary>Gets or sets the JSON change payload.</summary>
    public string Changes { get; set; } = string.Empty;

    /// <summary>Gets or sets the creation time.</summary>
    public DateTime CreatedAt { get; set; }
}

/// <summary>Represents a paged audit log query result.</summary>
public sealed class AuditLogPageDto
{
    /// <summary>Gets or sets the audit log rows.</summary>
    public IReadOnlyList<AuditLogListItemDto> Items { get; set; } = [];

    /// <summary>Gets or sets the current page number.</summary>
    public int PageNumber { get; set; }

    /// <summary>Gets or sets the page size.</summary>
    public int PageSize { get; set; }

    /// <summary>Gets or sets the total records count.</summary>
    public int TotalRecords { get; set; }

    /// <summary>Gets the total page count.</summary>
    public int TotalPages => PageSize <= 0
        ? 0
        : (int)Math.Ceiling((double)TotalRecords / PageSize);

    /// <summary>Creates a paged result.</summary>
    public static AuditLogPageDto Create(
        IReadOnlyList<AuditLogListItemDto> items,
        int pageNumber,
        int pageSize,
        int totalRecords)
    {
        return new AuditLogPageDto
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords
        };
    }
}
