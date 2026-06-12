using Template.Core.Common.Models;

namespace Template.API.Middleware;

/// <summary>Handles unhandled exceptions and returns API-safe responses.</summary>
public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    /// <summary>Invokes the middleware pipeline.</summary>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await WriteErrorResponseAsync(context, exception);
        }
    }

    /// <summary>Writes a normalized error response.</summary>
    private async Task WriteErrorResponseAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Unhandled exception occurred.");

        if (context.Response.HasStarted)
        {
            return;
        }

        var (statusCode, message, errors) = MapException(exception);

        context.Response.Clear();
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = ApiResponse<object>.Failure(message, errors);
        await context.Response.WriteAsJsonAsync(response);
    }

    /// <summary>Maps exceptions to client-safe responses.</summary>
    private (int StatusCode, string Message, IReadOnlyList<string> Errors) MapException(Exception exception)
    {
        return exception switch
        {
            KeyNotFoundException => (StatusCodes.Status404NotFound, "Resource not found.", []),
            UnauthorizedAccessException => (StatusCodes.Status403Forbidden, "Access denied.", []),
            ArgumentException => (StatusCodes.Status400BadRequest, exception.Message, [exception.Message]),
            InvalidOperationException => (StatusCodes.Status400BadRequest, exception.Message, [exception.Message]),
            _ => (
                StatusCodes.Status500InternalServerError,
                _environment.IsDevelopment()
                    ? exception.Message
                    : "An unexpected error occurred.",
                _environment.IsDevelopment() ? [exception.Message] : [])
        };
    }
}
