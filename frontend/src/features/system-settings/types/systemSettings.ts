export interface SystemAppSettings {
  appName: string;
  appUrl: string;
  apiBaseUrl: string;
  timeZone: string;
}

export interface SystemMailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableSsl: boolean;
}

export interface SystemBrandingSettings {
  companyName: string;
  supportEmail: string;
  logoUrl: string;
}

export interface SystemSettingsPayload {
  app: SystemAppSettings;
  mail: SystemMailSettings;
  branding: SystemBrandingSettings;
}

export interface SystemSettingDto {
  id: string;
  key: string;
  group: string;
  description: string;
  value: SystemSettingsPayload;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveSystemSettingsInput {
  key: string;
  group: string;
  description: string;
  value: SystemSettingsPayload;
}
