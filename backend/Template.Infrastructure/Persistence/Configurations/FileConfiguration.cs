using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using FileEntity = Template.Core.Entities.File;

namespace Template.Infrastructure.Persistence.Configurations;

/// <summary>Maps the files table.</summary>
public class FileConfiguration : IEntityTypeConfiguration<FileEntity>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<FileEntity> builder)
    {
        builder.ToTable("files");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entity => entity.FileName)
            .HasColumnName("file_name")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(entity => entity.StorageKey)
            .HasColumnName("storage_key")
            .IsRequired()
            .HasMaxLength(500);

        builder.HasIndex(entity => entity.StorageKey)
            .IsUnique();

        builder.Property(entity => entity.ContentType)
            .HasColumnName("content_type")
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(entity => entity.FileSize)
            .HasColumnName("file_size")
            .IsRequired()
            .HasColumnType("bigint");

        builder.Property(entity => entity.Url)
            .HasColumnName("url")
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(entity => entity.UploadedById)
            .HasColumnName("uploaded_by_id")
            .IsRequired();

        builder.HasIndex(entity => entity.UploadedById);

        builder.Property(entity => entity.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(entity => entity.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.Property(entity => entity.DeletedAt)
            .HasColumnName("deleted_at");

        builder.HasOne(entity => entity.UploadedBy)
            .WithMany()
            .HasForeignKey(entity => entity.UploadedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
