using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Core.Entities;

namespace Template.Infrastructure.Persistence.Configurations;

/// <summary>Maps the user_roles join table.</summary>
public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_roles");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entity => entity.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(entity => entity.RoleId)
            .HasColumnName("role_id")
            .IsRequired();

        builder.Property(entity => entity.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.HasIndex(entity => new { entity.UserId, entity.RoleId })
            .IsUnique();

        builder.HasIndex(entity => entity.UserId);
        builder.HasIndex(entity => entity.RoleId);

        builder.HasOne(entity => entity.User)
            .WithMany(entity => entity.UserRoles)
            .HasForeignKey(entity => entity.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(entity => entity.Role)
            .WithMany(entity => entity.UserRoles)
            .HasForeignKey(entity => entity.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
