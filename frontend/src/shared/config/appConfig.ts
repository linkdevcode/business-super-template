type AppConfig = {
  apiBaseUrl: string;
  appUrl?: string;
};

function getRequiredUrlEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return normalizeUrl(value, name);
}

function getOptionalUrlEnv(value: string | undefined, name: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return normalizeUrl(value, name);
}

function normalizeUrl(value: string, name: string): string {
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error(`Invalid URL for environment variable: ${name}`);
  }
}

export const appConfig: AppConfig = {
  apiBaseUrl: getRequiredUrlEnv(import.meta.env.VITE_API_BASE_URL, "VITE_API_BASE_URL"),
  appUrl: getOptionalUrlEnv(import.meta.env.VITE_APP_URL, "VITE_APP_URL"),
};
