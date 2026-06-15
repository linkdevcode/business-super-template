using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Template.Core.Common.Interfaces;
using Template.Core.Common.Models;
using FileEntity = Template.Core.Entities.File;
using Template.Core.Entities;
using NotificationEntity = Template.Core.Entities.Notification;
using System.Text.Json;

namespace Template.Infrastructure.Persistence;

/// <summary>Application DbContext for PostgreSQL persistence.</summary>
public class AppDbContext : DbContext, IUnitOfWork
{
    private static readonly JsonSerializerOptions AuditLogJsonOptions = new(JsonSerializerDefaults.Web);

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    /// <summary>Gets the audit log set.</summary>
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    /// <summary>Gets the user set.</summary>
    public DbSet<User> Users => Set<User>();

    /// <summary>Gets the role set.</summary>
    public DbSet<Role> Roles => Set<Role>();

    /// <summary>Gets the permission set.</summary>
    public DbSet<Permission> Permissions => Set<Permission>();

    /// <summary>Gets the user-role link set.</summary>
    public DbSet<UserRole> UserRoles => Set<UserRole>();

    /// <summary>Gets the role-permission link set.</summary>
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    /// <summary>Gets the system setting set.</summary>
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

    /// <summary>Gets the file metadata set.</summary>
    public DbSet<FileEntity> Files => Set<FileEntity>();

    /// <summary>Gets the notification set.</summary>
    public DbSet<NotificationEntity> Notifications => Set<NotificationEntity>();

    /// <inheritdoc />
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var utcNow = DateTime.UtcNow;
        var auditLogs = PrepareTrackedEntities(utcNow);

        if (auditLogs.Count > 0)
        {
            AuditLogs.AddRange(auditLogs);
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    /// <inheritdoc />
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        ApplySoftDeleteQueryFilters(modelBuilder);
    }

    private List<AuditLog> PrepareTrackedEntities(DateTime utcNow)
    {
        var auditLogs = new List<AuditLog>();

        PrepareStandaloneEntities(utcNow);

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    SetEntityIdentity(entry, utcNow);
                    auditLogs.Add(CreateAuditLog(entry, "CREATE", utcNow));
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = utcNow;
                    auditLogs.Add(CreateAuditLog(entry, "UPDATE", utcNow));
                    break;
                case EntityState.Deleted:
                    entry.State = EntityState.Modified;
                    entry.Entity.DeletedAt = utcNow;
                    entry.Entity.UpdatedAt = utcNow;
                    auditLogs.Add(CreateAuditLog(entry, "DELETE", utcNow));
                    break;
            }
        }

        foreach (var entry in ChangeTracker.Entries<AuditLog>())
        {
            if (entry.State == EntityState.Added && entry.Entity.Id == Guid.Empty)
            {
                entry.Entity.Id = Guid.NewGuid();
            }

            if (entry.State == EntityState.Added && entry.Entity.CreatedAt == default)
            {
                entry.Entity.CreatedAt = utcNow;
            }
        }

        return auditLogs;
    }

    private void PrepareStandaloneEntities(DateTime utcNow)
    {
        foreach (var entry in ChangeTracker.Entries<SystemSetting>())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity.Id == Guid.Empty)
                {
                    entry.Entity.Id = Guid.NewGuid();
                }

                if (entry.Entity.CreatedAt == default)
                {
                    entry.Entity.CreatedAt = utcNow;
                }

                entry.Entity.UpdatedAt = utcNow;
                continue;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = utcNow;
            }
        }

        foreach (var entry in ChangeTracker.Entries<UserRole>())
        {
            if (entry.State == EntityState.Added && entry.Entity.Id == Guid.Empty)
            {
                entry.Entity.Id = Guid.NewGuid();
            }

            if (entry.State == EntityState.Added && entry.Entity.CreatedAt == default)
            {
                entry.Entity.CreatedAt = utcNow;
            }
        }

        foreach (var entry in ChangeTracker.Entries<RolePermission>())
        {
            if (entry.State == EntityState.Added && entry.Entity.Id == Guid.Empty)
            {
                entry.Entity.Id = Guid.NewGuid();
            }

            if (entry.State == EntityState.Added && entry.Entity.CreatedAt == default)
            {
                entry.Entity.CreatedAt = utcNow;
            }
        }
    }

    private static void SetEntityIdentity(EntityEntry<BaseEntity> entry, DateTime utcNow)
    {
        if (entry.Entity.Id == Guid.Empty)
        {
            entry.Entity.Id = Guid.NewGuid();
        }

        entry.Entity.CreatedAt = utcNow;
        entry.Entity.UpdatedAt = utcNow;
        entry.Entity.DeletedAt = null;
    }

    private static AuditLog CreateAuditLog(
        EntityEntry<BaseEntity> entry,
        string action,
        DateTime utcNow)
    {
        var before = action switch
        {
            "CREATE" => new Dictionary<string, object?>(StringComparer.Ordinal),
            "UPDATE" => Snapshot(
                entry,
                includeDeletedAt: false,
                onlyModified: true,
                valueSelector: property => property.OriginalValue),
            "DELETE" => Snapshot(
                entry,
                includeDeletedAt: false,
                onlyModified: false,
                valueSelector: property => property.OriginalValue),
            _ => new Dictionary<string, object?>(StringComparer.Ordinal)
        };

        var after = action switch
        {
            "CREATE" => Snapshot(
                entry,
                includeDeletedAt: false,
                onlyModified: false,
                valueSelector: property => property.CurrentValue),
            "UPDATE" => Snapshot(
                entry,
                includeDeletedAt: false,
                onlyModified: true,
                valueSelector: property => property.CurrentValue),
            "DELETE" => Snapshot(
                entry,
                includeDeletedAt: true,
                onlyModified: false,
                valueSelector: property => property.CurrentValue),
            _ => new Dictionary<string, object?>(StringComparer.Ordinal)
        };

        return new AuditLog
        {
            Id = Guid.NewGuid(),
            EntityType = entry.Metadata.ClrType.Name,
            EntityId = entry.Entity.Id,
            Action = action,
            Changes = JsonSerializer.Serialize(new { before, after }, AuditLogJsonOptions),
            CreatedAt = utcNow
        };
    }

    private static Dictionary<string, object?> Snapshot(
        EntityEntry<BaseEntity> entry,
        bool includeDeletedAt,
        bool onlyModified,
        Func<PropertyEntry, object?> valueSelector)
    {
        var snapshot = new Dictionary<string, object?>(StringComparer.Ordinal);

        foreach (var property in entry.Properties)
        {
            if (onlyModified && !property.IsModified)
            {
                continue;
            }

            if (ShouldSkipProperty(property.Metadata.Name, includeDeletedAt))
            {
                continue;
            }

            snapshot[property.Metadata.Name] = valueSelector(property);
        }

        return snapshot;
    }

    private static bool ShouldSkipProperty(string propertyName, bool includeDeletedAt)
    {
        if (propertyName is nameof(BaseEntity.CreatedAt) or nameof(BaseEntity.UpdatedAt) or nameof(User.PasswordHash))
        {
            return true;
        }

        if (!includeDeletedAt && propertyName == nameof(BaseEntity.DeletedAt))
        {
            return true;
        }

        return false;
    }

    private static void ApplySoftDeleteQueryFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (entityType.ClrType is null || !typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
            {
                continue;
            }

            ApplySoftDeleteQueryFilter(modelBuilder, entityType.ClrType);
        }
    }

    private static void ApplySoftDeleteQueryFilter(ModelBuilder modelBuilder, Type clrType)
    {
        var method = typeof(AppDbContext)
            .GetMethod(nameof(ApplySoftDeleteQueryFilterInternal), BindingFlags.NonPublic | BindingFlags.Static);

        if (method is null)
        {
            throw new InvalidOperationException("Soft delete filter helper could not be found.");
        }

        var genericMethod = method.MakeGenericMethod(clrType);
        genericMethod.Invoke(null, [modelBuilder]);
    }

    private static void ApplySoftDeleteQueryFilterInternal<TEntity>(ModelBuilder modelBuilder)
        where TEntity : class, ISoftDelete
    {
        modelBuilder.Entity<TEntity>().HasQueryFilter(entity => entity.DeletedAt == null);
    }
}
