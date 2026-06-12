namespace Template.Core.Common.Models;

/// <summary>Represents a paginated API response payload.</summary>
public class PagedResponse<T>
{
    /// <summary>Gets or sets the items in the current page.</summary>
    public IReadOnlyList<T> Items { get; init; } = [];

    /// <summary>Gets or sets the current page number.</summary>
    public int PageNumber { get; init; }

    /// <summary>Gets or sets the size of the page.</summary>
    public int PageSize { get; init; }

    /// <summary>Gets or sets the total number of matching records.</summary>
    public int TotalRecords { get; init; }

    /// <summary>Gets the total number of pages.</summary>
    public int TotalPages => PageSize <= 0
        ? 0
        : (int)Math.Ceiling((double)TotalRecords / PageSize);

    /// <summary>Creates a paged response from the supplied values.</summary>
    public static PagedResponse<T> Create(
        IReadOnlyList<T> items,
        int pageNumber,
        int pageSize,
        int totalRecords)
    {
        return new PagedResponse<T>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords
        };
    }
}
