using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Core.Entities;

namespace Template.Infrastructure.Persistence.Configurations;

/// <summary>Maps the roles table.</summary>
public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entity => entity.Name)
            .HasColumnName("name")
            .IsRequired()
            .HasMaxLength(150);

        builder.HasIndex(entity => entity.Name)
            .IsUnique();

        builder.Property(entity => entity.Description)
            .HasColumnName("description")
            .HasMaxLength(500);

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
