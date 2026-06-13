using Microsoft.AspNetCore.Authorization;

namespace Template.Infrastructure.Auth;

/// <summary>Represents a permission requirement for authorization.</summary>
public sealed class PermissionRequirement : IAuthorizationRequirement
{
    /// <summary>Creates a new permission requirement.</summary>
    public PermissionRequirement(string permission)
    {
        Permission = permission;
    }

    /// <summary>Gets the permission key required to authorize the request.</summary>
    public string Permission { get; }
}
