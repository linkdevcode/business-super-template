using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Template.Core.Features.Auth;

namespace Template.Infrastructure.Auth;

/// <summary>Registers auth infrastructure services.</summary>
public static class DependencyInjection
{
    /// <summary>Adds auth services and JWT bearer authentication.</summary>
    public static IServiceCollection AddAuthenticationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var authSection = configuration.GetSection(AuthOptions.SectionName);
        var authOptions = authSection.Get<AuthOptions>() ?? new AuthOptions();

        ValidateAuthOptions(authOptions);

        services.AddOptions<AuthOptions>()
            .Bind(authSection)
            .Validate(ValidateAuthOptions, "Auth configuration is invalid.")
            .ValidateOnStart();

        services.AddSingleton<IIdentityService, IdentityService>();
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionAuthorizationPolicyProvider>();
        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
        services.AddScoped<LoginHandler>();
        services.AddScoped<RefreshSessionHandler>();
        services.AddScoped<LogoutHandler>();
        services.AddScoped<GetCurrentUserHandler>();

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authOptions.Issuer,
                    ValidateAudience = true,
                    ValidAudience = authOptions.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authOptions.Secret)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    NameClaimType = "name",
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role
                };
            });

        return services;
    }

    private static bool ValidateAuthOptions(AuthOptions options)
    {
        return !string.IsNullOrWhiteSpace(options.Issuer)
            && !string.IsNullOrWhiteSpace(options.Audience)
            && !string.IsNullOrWhiteSpace(options.Secret)
            && options.Secret.Length >= 32
            && !string.IsNullOrWhiteSpace(options.DemoAccount.Email)
            && !string.IsNullOrWhiteSpace(options.DemoAccount.Password)
            && !string.IsNullOrWhiteSpace(options.DemoAccount.FullName);
    }
}
