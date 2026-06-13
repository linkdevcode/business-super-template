using System.Security.Claims;

namespace Template.Core.Features.Auth;

/// <summary>Orchestrates the login use case.</summary>
public sealed class LoginHandler
{
    private readonly IIdentityService _identityService;

    /// <summary>Creates a new login handler.</summary>
    public LoginHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    /// <summary>Executes the login workflow.</summary>
    public Task<AuthLoginResult> HandleAsync(LoginCommand command, CancellationToken cancellationToken = default)
    {
        return _identityService.LoginAsync(command, cancellationToken);
    }
}

/// <summary>Orchestrates the refresh session use case.</summary>
public sealed class RefreshSessionHandler
{
    private readonly IIdentityService _identityService;

    /// <summary>Creates a new refresh session handler.</summary>
    public RefreshSessionHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    /// <summary>Executes the refresh workflow.</summary>
    public Task<AuthLoginResult> HandleAsync(RefreshSessionCommand command, CancellationToken cancellationToken = default)
    {
        return _identityService.RefreshSessionAsync(command, cancellationToken);
    }
}

/// <summary>Orchestrates the logout use case.</summary>
public sealed class LogoutHandler
{
    private readonly IIdentityService _identityService;

    /// <summary>Creates a new logout handler.</summary>
    public LogoutHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    /// <summary>Executes the logout workflow.</summary>
    public Task HandleAsync(LogoutCommand command, CancellationToken cancellationToken = default)
    {
        return _identityService.LogoutAsync(command, cancellationToken);
    }
}

/// <summary>Resolves the current user from the access token claims principal.</summary>
public sealed class GetCurrentUserHandler
{
    private readonly IIdentityService _identityService;

    /// <summary>Creates a new current user handler.</summary>
    public GetCurrentUserHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    /// <summary>Executes the current user lookup.</summary>
    public Task<AuthUserDto?> HandleAsync(
        GetCurrentUserQuery query,
        ClaimsPrincipal principal,
        CancellationToken cancellationToken = default)
    {
        return _identityService.GetCurrentUserAsync(query, principal, cancellationToken);
    }
}
