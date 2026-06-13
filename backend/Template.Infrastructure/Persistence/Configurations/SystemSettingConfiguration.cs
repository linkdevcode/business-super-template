using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Core.Entities;

namespace Template.Infrastructure.Persistence.Configurations;

/// <summary>Maps the system_settings table.</summary>
public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<SystemSetting> builder)
    {
        builder.ToTable("system_settings");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entity => entity.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(150);

        builder.HasIndex(entity => entity.Key)
            .IsUnique();

        builder.Property(entity => entity.Group)
            .HasColumnName("group")
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(entity => entity.Description)
            .HasColumnName("description")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(entity => entity.Value)
            .HasColumnName("value")
            .IsRequired()
            .HasColumnType("jsonb");

        builder.Property(entity => entity.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(entity => entity.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.Property(entity => entity.UpdatedBy)
            .HasColumnName("updated_by")
            .HasMaxLength(150);
    }
}
