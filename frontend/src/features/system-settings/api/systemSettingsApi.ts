import { apiClient } from "../../../shared/http/axiosClient";
import type { ApiResponse } from "../../../shared/http/httpTypes";
import type { SaveSystemSettingsInput, SystemSettingDto } from "../types/systemSettings";

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data === null) {
    throw new Error(response.message ?? "Request failed.");
  }

  return response.data;
}

export interface GetSystemSettingsParams {
  key?: string;
}

export async function getSystemSettings(
  params: GetSystemSettingsParams = {},
): Promise<SystemSettingDto> {
  const response = await apiClient.get<ApiResponse<SystemSettingDto>>("/api/system-settings", {
    params,
  });

  return unwrapApiResponse(response.data);
}

export async function saveSystemSettings(
  input: SaveSystemSettingsInput,
): Promise<SystemSettingDto> {
  const response = await apiClient.put<ApiResponse<SystemSettingDto>>("/api/system-settings", input);
  return unwrapApiResponse(response.data);
}
