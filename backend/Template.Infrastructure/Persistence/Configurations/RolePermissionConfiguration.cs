using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Core.Entities;

namespace Template.Infrastructure.Persistence.Configurations;

/// <summary>Maps the role_permissions join table.</summary>
public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("role_permissions");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entity => entity.RoleId)
            .HasColumnName("role_id")
            .IsRequired();

        builder.Property(entity => entity.PermissionId)
            .HasColumnName("permission_id")
            .IsRequired();

        builder.Property(entity => entity.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.HasIndex(entity => new { entity.RoleId, entity.PermissionId })
            .IsUnique();

        builder.HasIndex(entity => entity.RoleId);
        builder.HasIndex(entity => entity.PermissionId);

        builder.HasOne(entity => entity.Role)
            .WithMany(entity => entity.RolePermissions)
            .HasForeignKey(entity => entity.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(entity => entity.Permission)
            .WithMany(entity => entity.RolePermissions)
            .HasForeignKey(entity => entity.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
