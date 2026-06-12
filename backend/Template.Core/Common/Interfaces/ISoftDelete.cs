namespace Template.Core.Common.Interfaces;

/// <summary>Marks an entity that supports soft delete.</summary>
public interface ISoftDelete
{
    /// <summary>Gets or sets the time the entity was soft deleted.</summary>
    DateTime? DeletedAt { get; set; }
}
