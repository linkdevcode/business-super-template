using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Template.Core.Common.Interfaces;
using Template.Core.Features.FileManagement;
using Template.Core.Features.Permissions;
using Template.Core.Features.Roles;
using Template.Infrastructure.Auth;
using Template.Infrastructure.Features.FileManagement.Repositories;
using Template.Infrastructure.Storage;
using Template.Infrastructure.Persistence;
using Template.Infrastructure.Persistence.Repositories;
using Template.Infrastructure.Features.Permissions.Repositories;
using Template.Infrastructure.Features.Roles.Repositories;

namespace Template.Infrastructure;

/// <summary>Registers infrastructure services.</summary>
public static class DependencyInjection
{
    /// <summary>Adds infrastructure services to the dependency injection container.</summary>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = ResolveConnectionString(configuration);
        var storageSection = configuration.GetSection(SupabaseStorageOptions.SectionName);

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        services.AddOptions<SupabaseStorageOptions>()
            .Bind(storageSection)
            .Validate(ValidateStorageOptions, "Storage configuration is invalid.")
            .ValidateOnStart();

        services.AddScoped<IUnitOfWork>(serviceProvider => serviceProvider.GetRequiredService<AppDbContext>());
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IPermissionRepository, PermissionRepository>();
        services.AddScoped<IFileRepository, FileRepository>();
        services.AddScoped<IStorageProvider, SupabaseStorageProvider>();
        services.AddScoped<GetRolesHandler>();
        services.AddScoped<GetRoleByIdHandler>();
        services.AddScoped<CreateRoleHandler>();
        services.AddScoped<UpdateRoleHandler>();
        services.AddScoped<DeleteRoleHandler>();
        services.AddScoped<GetPermissionsHandler>();
        services.AddScoped<UploadFileHandler>();
        services.AddScoped<GetFileHandler>();
        services.AddScoped<DeleteFileHandler>();
        services.AddAuthenticationServices(configuration);

        return services;
    }

    /// <summary>Resolves the database connection string from configuration.</summary>
    private static string ResolveConnectionString(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? configuration["DATABASE_URL"];

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Database connection string is missing.");
        }

        return connectionString;
    }

    /// <summary>Validates storage options during startup.</summary>
    private static bool ValidateStorageOptions(SupabaseStorageOptions options)
    {
        return !string.IsNullOrWhiteSpace(options.SupabaseUrl)
            && !string.IsNullOrWhiteSpace(options.SupabaseApiKey)
            && !string.IsNullOrWhiteSpace(options.BucketName);
    }
}
