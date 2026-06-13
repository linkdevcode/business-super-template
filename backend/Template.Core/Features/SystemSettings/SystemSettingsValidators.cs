using FluentValidation;

namespace Template.Core.Features.SystemSettings;

/// <summary>Validates system settings payloads before persistence.</summary>
public sealed class SaveSystemSettingsCommandValidator : AbstractValidator<SaveSystemSettingsCommand>
{
    /// <summary>Creates a new validator.</summary>
    public SaveSystemSettingsCommandValidator()
    {
        RuleFor(command => command.Key)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(command => command.Group)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(command => command.Description)
            .NotEmpty()
            .MaximumLength(500);

        RuleFor(command => command.Value)
            .NotNull();

        When(command => command.Value is not null, () =>
        {
            RuleFor(command => command.Value.App)
                .NotNull();

            When(command => command.Value.App is not null, () =>
            {
                RuleFor(command => command.Value.App.AppName)
                    .NotEmpty()
                    .MaximumLength(200);

                RuleFor(command => command.Value.App.AppUrl)
                    .Must(BeValidUrl)
                    .When(command => !string.IsNullOrWhiteSpace(command.Value.App.AppUrl))
                    .WithMessage("App URL must be a valid URL.");

                RuleFor(command => command.Value.App.ApiBaseUrl)
                    .Must(BeValidUrl)
                    .When(command => !string.IsNullOrWhiteSpace(command.Value.App.ApiBaseUrl))
                    .WithMessage("API base URL must be a valid URL.");

                RuleFor(command => command.Value.App.TimeZone)
                    .NotEmpty()
                    .MaximumLength(100);
            });

            RuleFor(command => command.Value.Mail)
                .NotNull();

            When(command => command.Value.Mail is not null, () =>
            {
                RuleFor(command => command.Value.Mail.SmtpHost)
                    .NotEmpty()
                    .MaximumLength(200);

                RuleFor(command => command.Value.Mail.SmtpPort)
                    .InclusiveBetween(1, 65535);

                RuleFor(command => command.Value.Mail.SmtpUsername)
                    .MaximumLength(200);

                RuleFor(command => command.Value.Mail.SmtpPassword)
                    .MaximumLength(200);

                RuleFor(command => command.Value.Mail.FromEmail)
                    .NotEmpty()
                    .EmailAddress()
                    .MaximumLength(200);

                RuleFor(command => command.Value.Mail.FromName)
                    .NotEmpty()
                    .MaximumLength(200);
            });

            RuleFor(command => command.Value.Branding)
                .NotNull();

            When(command => command.Value.Branding is not null, () =>
            {
                RuleFor(command => command.Value.Branding.CompanyName)
                    .NotEmpty()
                    .MaximumLength(200);

                RuleFor(command => command.Value.Branding.SupportEmail)
                    .EmailAddress()
                    .When(command => !string.IsNullOrWhiteSpace(command.Value.Branding.SupportEmail))
                    .WithMessage("Support email must be a valid email address.");

                RuleFor(command => command.Value.Branding.LogoUrl)
                    .Must(BeValidUrl)
                    .When(command => !string.IsNullOrWhiteSpace(command.Value.Branding.LogoUrl))
                    .WithMessage("Logo URL must be a valid URL.");
            });
        });
    }

    private static bool BeValidUrl(string? value)
    {
        return Uri.TryCreate(value, UriKind.Absolute, out _);
    }
}
