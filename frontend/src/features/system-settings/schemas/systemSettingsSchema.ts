import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .max(2048, "URL is too long.")
  .refine((value) => value.trim() === "" || isValidUrl(value), "Must be a valid URL.");

const optionalEmailSchema = z
  .string()
  .max(200, "Email is too long.")
  .refine((value) => value.trim() === "" || z.string().email().safeParse(value).success, {
    message: "Must be a valid email address.",
  });

export const systemSettingsSchema = z.object({
  app: z.object({
    appName: z.string().trim().min(1, "Application name is required.").max(200),
    appUrl: optionalUrlSchema,
    apiBaseUrl: optionalUrlSchema,
    timeZone: z.string().trim().min(1, "Time zone is required.").max(100),
  }),
  mail: z.object({
    smtpHost: z.string().trim().min(1, "SMTP host is required.").max(200),
    smtpPort: z.number().int().min(1).max(65535),
    smtpUsername: z.string().max(200),
    smtpPassword: z.string().max(200),
    fromEmail: z.string().trim().email("Must be a valid email address.").max(200),
    fromName: z.string().max(200),
    enableSsl: z.boolean(),
  }),
  branding: z.object({
    companyName: z.string().trim().min(1, "Company name is required.").max(200),
    supportEmail: optionalEmailSchema,
    logoUrl: optionalUrlSchema,
  }),
});

export type SystemSettingsFormValues = z.infer<typeof systemSettingsSchema>;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return Boolean(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}
