import axios, {
  AxiosHeaders,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { appConfig } from "../config/appConfig";
import { clearAccessToken, getAccessToken, setAccessToken } from "./tokenStore";
import type { ApiResponse, AuthSessionDto } from "./httpTypes";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    config.headers = headers;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshedAccessToken = await getRefreshedAccessToken();

    if (!refreshedAccessToken) {
      clearAccessToken();
      redirectToLogin();
      return Promise.reject(error);
    }

    const headers = AxiosHeaders.from(originalRequest.headers);
    headers.set("Authorization", `Bearer ${refreshedAccessToken}`);
    originalRequest.headers = headers;

    return apiClient(originalRequest);
  },
);

async function getRefreshedAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken();
  }

  return await refreshPromise;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await refreshClient.post<ApiResponse<AuthSessionDto>>("/auth/refresh");
    const refreshedSession = response.data.data;

    if (!refreshedSession) {
      throw new Error("Refresh response did not include a session.");
    }

    const refreshedAccessToken = refreshedSession.accessToken.trim();

    if (!refreshedAccessToken) {
      throw new Error("Refresh response did not include an access token.");
    }

    setAccessToken(refreshedAccessToken);
    return refreshedAccessToken;
  } catch {
    return null;
  } finally {
    refreshPromise = null;
  }
}

function redirectToLogin(): void {
  window.location.href = "/login";
}

export { apiClient, refreshClient };
