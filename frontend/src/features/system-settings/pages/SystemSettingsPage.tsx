import { useEffect, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
          <h1 className="text-2xl font-semibold">System Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure application, mail, and branding settings from a single JSON payload.
          </p>
        </div>

        <HasPermission permission={PERMISSION_KEYS.SystemSetting.Update}>
          <Button onClick={handleSubmit(onSubmit)} disabled={formState.isSubmitting || updateSystemSettingsMutation.isPending}>
            Save Settings
          </Button>
        </HasPermission>
      </div>

      {systemSettingsQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Loading system settings...
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
              <h2 className="text-lg font-semibold">Application</h2>
              <p className="text-sm text-muted-foreground">Main application metadata and endpoints.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Application Name" error={formState.errors.app?.appName?.message}>
                <Input {...register("app.appName")} placeholder="My Super Template" />
              </Field>
              <Field label="Time Zone" error={formState.errors.app?.timeZone?.message}>
                <Input {...register("app.timeZone")} placeholder="Asia/Ho_Chi_Minh" />
              </Field>
              <Field label="Application URL" error={formState.errors.app?.appUrl?.message}>
                <Input {...register("app.appUrl")} placeholder="https://app.example.com" />
              </Field>
              <Field label="API Base URL" error={formState.errors.app?.apiBaseUrl?.message}>
                <Input {...register("app.apiBaseUrl")} placeholder="https://api.example.com" />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Mail</h2>
              <p className="text-sm text-muted-foreground">SMTP settings used by the backend email provider.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="SMTP Host" error={formState.errors.mail?.smtpHost?.message}>
                <Input {...register("mail.smtpHost")} placeholder="smtp.example.com" />
              </Field>
              <Field label="SMTP Port" error={formState.errors.mail?.smtpPort?.message}>
                <Input type="number" {...register("mail.smtpPort", { valueAsNumber: true })} />
              </Field>
              <Field label="SMTP Username" error={formState.errors.mail?.smtpUsername?.message}>
                <Input {...register("mail.smtpUsername")} placeholder="smtp-user" />
              </Field>
              <Field label="SMTP Password" error={formState.errors.mail?.smtpPassword?.message}>
                <Input type="password" {...register("mail.smtpPassword")} placeholder="••••••••" />
              </Field>
              <Field label="From Email" error={formState.errors.mail?.fromEmail?.message}>
                <Input {...register("mail.fromEmail")} placeholder="hello@example.com" />
              </Field>
              <Field label="From Name" error={formState.errors.mail?.fromName?.message}>
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
                  Enable SSL/TLS
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Branding</h2>
              <p className="text-sm text-muted-foreground">Public-facing visual identity and support contact.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company Name" error={formState.errors.branding?.companyName?.message}>
                <Input {...register("branding.companyName")} placeholder="ABC Factory" />
              </Field>
              <Field label="Support Email" error={formState.errors.branding?.supportEmail?.message}>
                <Input {...register("branding.supportEmail")} placeholder="support@example.com" />
              </Field>
              <Field label="Logo URL" error={formState.errors.branding?.logoUrl?.message}>
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
