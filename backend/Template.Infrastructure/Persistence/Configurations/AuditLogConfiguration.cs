using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Core.Common.Models;

namespace Template.Infrastructure.Persistence.Configurations;

/// <summary>Maps the audit log table.</summary>
public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entity => entity.EntityType)
            .HasColumnName("entity_type")
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(entity => entity.EntityId)
            .HasColumnName("entity_id")
            .IsRequired();

        builder.Property(entity => entity.Action)
            .HasColumnName("action")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(entity => entity.Changes)
            .HasColumnName("changes")
            .IsRequired()
            .HasColumnType("jsonb");

        builder.Property(entity => entity.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(entity => entity.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.HasIndex(entity => new { entity.EntityType, entity.EntityId });
        builder.HasIndex(entity => entity.CreatedAt);
    }
}
