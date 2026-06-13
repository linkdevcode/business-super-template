using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Template.Infrastructure.Notifications;

/// <summary>Provides helpers for extracting authenticated user identifiers.</summary>
public static class ClaimsPrincipalExtensions
{
    /// <summary>Gets the authenticated user identifier when present.</summary>
    public static Guid? GetUserId(this ClaimsPrincipal? principal)
    {
        if (principal?.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        var subject = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(subject, out var userId) ? userId : null;
    }
}
