using Template.Core.Features.Auth;

namespace Template.Infrastructure.Auth;

/// <summary>Represents a refresh token session stored in memory.</summary>
internal sealed class RefreshTokenRecord
{
    /// <summary>Gets or sets the hashed refresh token.</summary>
    public string TokenHash { get; set; } = string.Empty;

    /// <summary>Gets or sets the user id associated with the session.</summary>
    public Guid UserId { get; set; }

    /// <summary>Gets or sets the user snapshot.</summary>
    public AuthUserDto User { get; set; } = new();

    /// <summary>Gets or sets the refresh token expiry time.</summary>
    public DateTimeOffset ExpiresAt { get; set; }

    /// <summary>Gets or sets the revocation time, when applicable.</summary>
    public DateTimeOffset? RevokedAt { get; set; }
}
