import { apiClient, refreshClient } from "../../../shared/http/axiosClient";
import type { ApiResponse, AuthSessionDto, AuthUserDto } from "../../../shared/http/httpTypes";
import type { LoginInput } from "../types/auth";

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data === null) {
    throw new Error(response.message ?? "Request failed.");
  }

  return response.data;
}

export async function login(input: LoginInput): Promise<AuthSessionDto> {
  const response = await refreshClient.post<ApiResponse<AuthSessionDto>>("/auth/login", input);
  return unwrapApiResponse(response.data);
}

export async function refreshSession(): Promise<AuthSessionDto> {
  const response = await refreshClient.post<ApiResponse<AuthSessionDto>>("/auth/refresh");
  return unwrapApiResponse(response.data);
}

export async function logout(): Promise<void> {
  await refreshClient.post<ApiResponse<object>>("/auth/logout");
}

export async function getCurrentUser(): Promise<AuthUserDto> {
  const response = await apiClient.get<ApiResponse<AuthUserDto>>("/auth/me");
  return unwrapApiResponse(response.data);
}
