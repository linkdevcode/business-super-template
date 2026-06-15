import { useEffect, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { HasPermission } from "../../permission";
import { PERMISSION_KEYS } from "../../permission/constants/permissionKeys";
import { useSystemSettings } from "../hooks/useSystemSettings";
import { useUpdateSystemSettings } from "../hooks/useUpdateSystemSettings";
import { systemSettingsSchema, type SystemSettingsFormValues } from "../schemas/systemSettingsSchema";
import type { SaveSystemSettingsInput } from "../types/systemSettings";

const DEFAULT_SETTINGS_KEY = "default";
const DEFAULT_SETTINGS_GROUP = "system";
const DEFAULT_SETTINGS_DESCRIPTION = "System configuration";

const defaultValues: SystemSettingsFormValues = {
  app: {
    appName: "",
    appUrl: "",
    apiBaseUrl: "",
    timeZone: "",
  },
  mail: {
    smtpHost: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
    enableSsl: true,
  },
  branding: {
    companyName: "",
    supportEmail: "",
    logoUrl: "",
  },
};

/** Summary: System settings configuration page. */
export function SystemSettingsPage(): ReactElement {
  const { t } = useTranslation();
  const systemSettingsQuery = useSystemSettings(DEFAULT_SETTINGS_KEY);
  const updateSystemSettingsMutation = useUpdateSystemSettings();

  const form = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues,
  });

  const { register, handleSubmit, reset, formState } = form;

  useEffect(() => {
    if (!systemSettingsQuery.data) {
      return;
    }

    reset(systemSettingsQuery.data.value);
  }, [reset, systemSettingsQuery.data]);

  const onSubmit = async (values: SystemSettingsFormValues): Promise<void> => {
    const input: SaveSystemSettingsInput = {
      key: systemSettingsQuery.data?.key ?? DEFAULT_SETTINGS_KEY,
      group: systemSettingsQuery.data?.group ?? DEFAULT_SETTINGS_GROUP,
      description: systemSettingsQuery.data?.description ?? DEFAULT_SETTINGS_DESCRIPTION,
      value: values,
    };

    await updateSystemSettingsMutation.mutateAsync(input);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("systemSettings.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("systemSettings.description")}</p>
        </div>

        <HasPermission permission={PERMISSION_KEYS.SystemSetting.Update}>
          <Button onClick={handleSubmit(onSubmit)} disabled={formState.isSubmitting || updateSystemSettingsMutation.isPending}>
            {t("systemSettings.saveSettings")}
          </Button>
        </HasPermission>
      </div>

      {systemSettingsQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          {t("systemSettings.loading")}
        </div>
      ) : null}

      {systemSettingsQuery.isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
          {systemSettingsQuery.error.message}
        </div>
      ) : null}

      {systemSettingsQuery.data ? (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{t("systemSettings.sections.application")}</h2>
              <p className="text-sm text-muted-foreground">{t("systemSettings.sections.applicationDescription")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("systemSettings.fields.appName")} error={formState.errors.app?.appName?.message}>
                <Input {...register("app.appName")} placeholder="My Super Template" />
              </Field>
              <Field label={t("systemSettings.fields.timeZone")} error={formState.errors.app?.timeZone?.message}>
                <Input {...register("app.timeZone")} placeholder="Asia/Ho_Chi_Minh" />
              </Field>
              <Field label={t("systemSettings.fields.appUrl")} error={formState.errors.app?.appUrl?.message}>
                <Input {...register("app.appUrl")} placeholder="https://app.example.com" />
              </Field>
              <Field label={t("systemSettings.fields.apiBaseUrl")} error={formState.errors.app?.apiBaseUrl?.message}>
                <Input {...register("app.apiBaseUrl")} placeholder="https://api.example.com" />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{t("systemSettings.sections.mail")}</h2>
              <p className="text-sm text-muted-foreground">{t("systemSettings.sections.mailDescription")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("systemSettings.fields.smtpHost")} error={formState.errors.mail?.smtpHost?.message}>
                <Input {...register("mail.smtpHost")} placeholder="smtp.example.com" />
              </Field>
              <Field label={t("systemSettings.fields.smtpPort")} error={formState.errors.mail?.smtpPort?.message}>
                <Input type="number" {...register("mail.smtpPort", { valueAsNumber: true })} />
              </Field>
              <Field label={t("systemSettings.fields.smtpUsername")} error={formState.errors.mail?.smtpUsername?.message}>
                <Input {...register("mail.smtpUsername")} placeholder="smtp-user" />
              </Field>
              <Field label={t("systemSettings.fields.smtpPassword")} error={formState.errors.mail?.smtpPassword?.message}>
                <Input type="password" {...register("mail.smtpPassword")} placeholder="••••••••" />
              </Field>
              <Field label={t("systemSettings.fields.fromEmail")} error={formState.errors.mail?.fromEmail?.message}>
                <Input {...register("mail.fromEmail")} placeholder="hello@example.com" />
              </Field>
              <Field label={t("systemSettings.fields.fromName")} error={formState.errors.mail?.fromName?.message}>
                <Input {...register("mail.fromName")} placeholder="My Super Template" />
              </Field>
              <div className="flex items-center gap-3 md:col-span-2">
                <input
                  id="mail.enableSsl"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  {...register("mail.enableSsl")}
                />
                <label htmlFor="mail.enableSsl" className="text-sm font-medium text-foreground">
                  {t("systemSettings.fields.enableSsl")}
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{t("systemSettings.sections.branding")}</h2>
              <p className="text-sm text-muted-foreground">{t("systemSettings.sections.brandingDescription")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("systemSettings.fields.companyName")} error={formState.errors.branding?.companyName?.message}>
                <Input {...register("branding.companyName")} placeholder="ABC Factory" />
              </Field>
              <Field label={t("systemSettings.fields.supportEmail")} error={formState.errors.branding?.supportEmail?.message}>
                <Input {...register("branding.supportEmail")} placeholder="support@example.com" />
              </Field>
              <Field label={t("systemSettings.fields.logoUrl")} error={formState.errors.branding?.logoUrl?.message}>
                <Input {...register("branding.logoUrl")} placeholder="https://cdn.example.com/logo.png" />
              </Field>
            </div>
          </div>
        </form>
      ) : null}
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactElement;
}): ReactElement {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
