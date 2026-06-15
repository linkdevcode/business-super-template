using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Template.Core.Common.Constants;
using Template.Core.Entities;
using Template.Core.Features.Auth;
using Template.Infrastructure.Persistence;

namespace Template.Infrastructure.Persistence.Seeding;

/// <summary>Seeds development data required for local authentication workflows.</summary>
public static class DevelopmentDataSeeder
{
    private const string AdminEmail = "admin@example.com";
    private const string AdminPassword = "Password123!";
    private const string AdminFullName = "Admin User";
    private const string AdminRoleName = "Admin";

    /// <summary>Seeds the development admin account when it does not already exist.</summary>
    public static async Task SeedAsync(IServiceProvider services, IHostEnvironment environment)
    {
        if (!environment.IsDevelopment())
        {
            return;
        }

        using var scope = services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DevelopmentDataSeeder");

        await dbContext.Database.MigrateAsync();

        var permissions = await EnsurePermissionsAsync(dbContext);
        var adminRole = await EnsureAdminRoleAsync(dbContext);
        await EnsureRolePermissionsAsync(dbContext, adminRole, permissions);

        if (await dbContext.Users.AnyAsync(user => user.Email == AdminEmail))
        {
            return;
        }

        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Email = AdminEmail,
            PasswordHash = passwordHasher.HashPassword(AdminPassword),
            FullName = AdminFullName,
            Status = "ACTIVE"
        };

        dbContext.Users.Add(adminUser);
        dbContext.UserRoles.Add(new UserRole
        {
            Id = Guid.NewGuid(),
            UserId = adminUser.Id,
            RoleId = adminRole.Id
        });

        await dbContext.SaveChangesAsync();
        logger.LogInformation("Seeded development admin account {Email}.", AdminEmail);
    }

    private static async Task<IReadOnlyList<Permission>> EnsurePermissionsAsync(AppDbContext dbContext)
    {
        var permissionDefinitions = new (string Key, string Name)[]
        {
            (PermissionKeys.Role.Read, "View Roles"),
            (PermissionKeys.Role.Create, "Create Roles"),
            (PermissionKeys.Role.Update, "Update Roles"),
            (PermissionKeys.Role.Delete, "Delete Roles"),
            (PermissionKeys.User.Read, "View Users"),
            (PermissionKeys.User.Update, "Update Users"),
            (PermissionKeys.Permission.Read, "View Permissions"),
            (PermissionKeys.File.Read, "View Files"),
            (PermissionKeys.File.Create, "Upload Files"),
            (PermissionKeys.File.Update, "Update Files"),
            (PermissionKeys.File.Delete, "Delete Files"),
            (PermissionKeys.SystemSetting.Read, "View System Settings"),
            (PermissionKeys.SystemSetting.Update, "Update System Settings"),
            (PermissionKeys.AuditLog.Read, "View Audit Logs")
        };

        var permissions = new List<Permission>();

        foreach (var definition in permissionDefinitions)
        {
            var permission = await dbContext.Permissions
                .FirstOrDefaultAsync(existing => existing.Key == definition.Key);

            if (permission is null)
            {
                permission = new Permission
                {
                    Id = Guid.NewGuid(),
                    Key = definition.Key,
                    Name = definition.Name
                };
                dbContext.Permissions.Add(permission);
            }

            permissions.Add(permission);
        }

        await dbContext.SaveChangesAsync();
        return permissions;
    }

    private static async Task<Role> EnsureAdminRoleAsync(AppDbContext dbContext)
    {
        var adminRole = await dbContext.Roles.FirstOrDefaultAsync(role => role.Name == AdminRoleName);
        if (adminRole is not null)
        {
            return adminRole;
        }

        adminRole = new Role
        {
            Id = Guid.NewGuid(),
            Name = AdminRoleName,
            Description = "Development administrator role."
        };

        dbContext.Roles.Add(adminRole);
        await dbContext.SaveChangesAsync();
        return adminRole;
    }

    private static async Task EnsureRolePermissionsAsync(
        AppDbContext dbContext,
        Role adminRole,
        IReadOnlyList<Permission> permissions)
    {
        var existingPermissionIds = await dbContext.RolePermissions
            .Where(rolePermission => rolePermission.RoleId == adminRole.Id)
            .Select(rolePermission => rolePermission.PermissionId)
            .ToListAsync();

        foreach (var permission in permissions)
        {
            if (existingPermissionIds.Contains(permission.Id))
            {
                continue;
            }

            dbContext.RolePermissions.Add(new RolePermission
            {
                Id = Guid.NewGuid(),
                RoleId = adminRole.Id,
                PermissionId = permission.Id
            });
        }

        await dbContext.SaveChangesAsync();
    }
}
