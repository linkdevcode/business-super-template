using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Template.Core.Common.Interfaces;
using Template.Infrastructure.Persistence;
using Template.Infrastructure.Persistence.Repositories;

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

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        services.AddScoped<IUnitOfWork>(serviceProvider => serviceProvider.GetRequiredService<AppDbContext>());
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

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
}
