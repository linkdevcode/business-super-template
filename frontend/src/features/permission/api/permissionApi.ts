import { apiClient } from "../../../shared/http/axiosClient";
import type { ApiResponse } from "../../../shared/http/httpTypes";
import type { PermissionGroupDto } from "../types/permission";

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data === null) {
    throw new Error(response.message ?? "Request failed.");
  }

  return response.data;
}

export async function getPermissions(): Promise<PermissionGroupDto[]> {
  const response = await apiClient.get<ApiResponse<PermissionGroupDto[]>>("/permissions");
  return unwrapApiResponse(response.data);
}
