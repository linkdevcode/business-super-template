using Microsoft.Extensions.Options;
using Supabase.Storage;
using Template.Core.Common.Interfaces;
using SupabaseFileOptions = Supabase.Storage.FileOptions;

namespace Template.Infrastructure.Storage;

/// <summary>Supabase Storage implementation of the file storage provider.</summary>
public sealed class SupabaseStorageProvider : IStorageProvider
{
    private readonly SupabaseStorageOptions _options;
    private readonly Client _client;

    /// <summary>Creates a new storage provider.</summary>
    public SupabaseStorageProvider(IOptions<SupabaseStorageOptions> options)
    {
        _options = options.Value;
        ValidateOptions(_options);

        var headers = new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["apikey"] = _options.SupabaseApiKey,
            ["Authorization"] = $"Bearer {_options.SupabaseApiKey}"
        };

        _client = new Client(_options.SupabaseUrl, headers);
    }

    /// <inheritdoc />
    public async Task<string> UploadAsync(
        Stream stream,
        string fileName,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var storageKey = NormalizeStorageKey(fileName);
        var bucket = _client.From(_options.BucketName);
        var fileOptions = new SupabaseFileOptions
        {
            ContentType = contentType.Trim(),
            Upsert = true
        };

        using var memoryStream = new MemoryStream();
        await stream.CopyToAsync(memoryStream, cancellationToken);

        await bucket.Upload(
            memoryStream.ToArray(),
            storageKey,
            fileOptions,
            inferContentType: false);

        return storageKey;
    }

    /// <inheritdoc />
    public async Task DeleteAsync(string storageKey, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var bucket = _client.From(_options.BucketName);
        await bucket.Remove(NormalizeStorageKey(storageKey));
    }

    /// <inheritdoc />
    public Task<string> GetUrlAsync(string storageKey, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var bucket = _client.From(_options.BucketName);
        var url = bucket.GetPublicUrl(NormalizeStorageKey(storageKey));
        return Task.FromResult(url);
    }

    private static void ValidateOptions(SupabaseStorageOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.SupabaseUrl))
        {
            throw new InvalidOperationException("Storage:SupabaseUrl is required.");
        }

        if (string.IsNullOrWhiteSpace(options.SupabaseApiKey))
        {
            throw new InvalidOperationException("Storage:SupabaseApiKey is required.");
        }

        if (string.IsNullOrWhiteSpace(options.BucketName))
        {
            throw new InvalidOperationException("Storage:BucketName is required.");
        }
    }

    private static string NormalizeStorageKey(string storageKey)
    {
        return storageKey.Trim().TrimStart('/');
    }
}
