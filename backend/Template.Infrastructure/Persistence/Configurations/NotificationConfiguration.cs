using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Core.Entities;

namespace Template.Infrastructure.Persistence.Configurations;

/// <summary>Maps the notifications table.</summary>
public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entity => entity.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.HasIndex(entity => entity.UserId);
        builder.HasIndex(entity => new { entity.UserId, entity.IsRead });
        builder.HasIndex(entity => new { entity.UserId, entity.CreatedAt });

        builder.Property(entity => entity.Title)
            .HasColumnName("title")
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(entity => entity.Content)
            .HasColumnName("content")
            .IsRequired()
            .HasMaxLength(4000);

        builder.Property(entity => entity.Type)
            .HasColumnName("type")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(entity => entity.IsRead)
            .HasColumnName("is_read")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(entity => entity.ReadAt)
            .HasColumnName("read_at");

        builder.Property(entity => entity.EntityType)
            .HasColumnName("entity_type")
            .HasMaxLength(200);

        builder.Property(entity => entity.EntityId)
            .HasColumnName("entity_id")
            .HasMaxLength(200);

        builder.Property(entity => entity.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(entity => entity.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.Property(entity => entity.DeletedAt)
            .HasColumnName("deleted_at");

        builder.HasOne(entity => entity.User)
            .WithMany()
            .HasForeignKey(entity => entity.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
