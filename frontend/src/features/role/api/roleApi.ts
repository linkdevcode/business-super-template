import { apiClient } from "../../../shared/http/axiosClient";
import type { ApiResponse, PagedResponse } from "../../../shared/http/httpTypes";
import type {
  CreateRoleInput,
  RoleDetailDto,
  RoleListItemDto,
  UpdateRoleInput,
} from "../types/role";

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data === null) {
    throw new Error(response.message ?? "Request failed.");
  }

  return response.data;
}

export interface GetRolesParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export async function getRoles(params: GetRolesParams): Promise<PagedResponse<RoleListItemDto>> {
  const response = await apiClient.get<ApiResponse<PagedResponse<RoleListItemDto>>>("/roles", {
    params,
  });

  return unwrapApiResponse(response.data);
}

export async function getRole(id: string): Promise<RoleDetailDto> {
  const response = await apiClient.get<ApiResponse<RoleDetailDto>>(`/roles/${id}`);
  return unwrapApiResponse(response.data);
}

export async function createRole(input: CreateRoleInput): Promise<RoleDetailDto> {
  const response = await apiClient.post<ApiResponse<RoleDetailDto>>("/roles", input);
  return unwrapApiResponse(response.data);
}

export async function updateRole(id: string, input: UpdateRoleInput): Promise<RoleDetailDto> {
  const response = await apiClient.put<ApiResponse<RoleDetailDto>>(`/roles/${id}`, input);
  return unwrapApiResponse(response.data);
}

export async function deleteRole(id: string): Promise<void> {
  await apiClient.delete<ApiResponse<object>>(`/roles/${id}`);
}
