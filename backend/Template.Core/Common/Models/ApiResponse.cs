namespace Template.Core.Common.Models;

/// <summary>Represents a standard API response envelope.</summary>
public class ApiResponse<T>
{
    /// <summary>Gets or sets a value indicating whether the request succeeded.</summary>
    public bool IsSuccess { get; init; }

    /// <summary>Gets or sets the response payload.</summary>
    public T? Data { get; init; }

    /// <summary>Gets or sets the human-readable response message.</summary>
    public string? Message { get; init; }

    /// <summary>Gets or sets the validation or processing errors.</summary>
    public IReadOnlyList<string> Errors { get; init; } = [];

    /// <summary>Creates a successful response.</summary>
    public static ApiResponse<T> Success(T? data = default, string? message = null)
    {
        return new ApiResponse<T>
        {
            IsSuccess = true,
            Data = data,
            Message = message
        };
    }

    /// <summary>Creates a failed response.</summary>
    public static ApiResponse<T> Failure(string message, IReadOnlyList<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            IsSuccess = false,
            Message = message,
            Errors = errors ?? []
        };
    }
}
