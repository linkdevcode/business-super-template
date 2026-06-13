using Microsoft.AspNetCore.Authorization;

namespace Template.Infrastructure.Auth;

/// <summary>Requires a specific permission key on controllers or actions.</summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public sealed class HasPermissionAttribute : AuthorizeAttribute
{
    /// <summary>Creates a new permission guard attribute.</summary>
    public HasPermissionAttribute(string permission)
    {
        Policy = permission;
    }
}
