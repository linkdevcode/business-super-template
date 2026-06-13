using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Core.Entities;

namespace Template.Infrastructure.Persistence.Configurations;

/// <summary>Maps the users table.</summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entity => entity.Email)
            .HasColumnName("email")
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(entity => entity.Email)
            .IsUnique();

        builder.Property(entity => entity.FullName)
            .HasColumnName("full_name")
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(entity => entity.AvatarUrl)
            .HasColumnName("avatar_url")
            .HasMaxLength(500);

        builder.Property(entity => entity.Status)
            .HasColumnName("status")
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(entity => entity.Status);

        builder.Property(entity => entity.LastLoginAt)
            .HasColumnName("last_login_at");

        builder.Property(entity => entity.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(entity => entity.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.Property(entity => entity.DeletedAt)
            .HasColumnName("deleted_at");
    }
}
