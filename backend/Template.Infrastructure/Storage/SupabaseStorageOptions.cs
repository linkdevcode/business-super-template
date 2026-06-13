namespace Template.Infrastructure.Storage;

/// <summary>Represents the Supabase storage configuration.</summary>
public sealed class SupabaseStorageOptions
{
    /// <summary>Gets the configuration section name.</summary>
    public const string SectionName = "Storage";

    /// <summary>Gets or sets the Supabase project URL.</summary>
    public string SupabaseUrl { get; set; } = string.Empty;

    /// <summary>Gets or sets the Supabase service role or API key.</summary>
    public string SupabaseApiKey { get; set; } = string.Empty;

    /// <summary>Gets or sets the storage bucket name.</summary>
    public string BucketName { get; set; } = string.Empty;
}
