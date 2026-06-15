namespace Template.Core.Features.Auth;

/// <summary>Defines password hashing and verification operations.</summary>
public interface IPasswordHasher
{
    /// <summary>Hashes a plain text password for persistence.</summary>
    string HashPassword(string plainPassword);

    /// <summary>Verifies a plain text password against a stored hash.</summary>
    bool VerifyPassword(string plainPassword, string passwordHash);
}
