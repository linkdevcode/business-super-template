using Template.Core.Common.Interfaces;

namespace Template.Core.Common.Models;

/// <summary>Base persistence model with audit and soft delete fields.</summary>
public abstract class BaseEntity : ISoftDelete
{
    /// <summary>Gets or sets the entity identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the time the entity was created.</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Gets or sets the time the entity was last updated.</summary>
    public DateTime UpdatedAt { get; set; }

    /// <summary>Gets or sets the time the entity was soft deleted.</summary>
    public DateTime? DeletedAt { get; set; }
}
