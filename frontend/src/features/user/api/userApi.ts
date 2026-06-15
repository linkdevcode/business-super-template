import { apiClient } from "../../../shared/http/axiosClient";
import type { ApiResponse, PagedResponse } from "../../../shared/http/httpTypes";
import type {
  AssignUserRolesInput,
  ChangePasswordInput,
  UpdateProfileInput,
  UpdateUserStatusInput,
  UserDetailDto,
  UserListItemDto,
  UserProfileDto,
} from "../types/user";

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data === null) {
    throw new Error(response.message ?? "Request failed.");
  }

  return response.data;
}

export interface GetUsersParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  status?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export async function getUsers(params: GetUsersParams): Promise<PagedResponse<UserListItemDto>> {
  const response = await apiClient.get<ApiResponse<PagedResponse<UserListItemDto>>>("/users", {
    params,
  });

  return unwrapApiResponse(response.data);
}

export async function getUser(id: string): Promise<UserDetailDto> {
  const response = await apiClient.get<ApiResponse<UserDetailDto>>(`/users/${id}`);
  return unwrapApiResponse(response.data);
}

export async function updateUserStatus(id: string, input: UpdateUserStatusInput): Promise<UserDetailDto> {
  const response = await apiClient.patch<ApiResponse<UserDetailDto>>(`/users/${id}/status`, input);
  return unwrapApiResponse(response.data);
}

export async function assignUserRoles(id: string, input: AssignUserRolesInput): Promise<UserDetailDto> {
  const response = await apiClient.put<ApiResponse<UserDetailDto>>(`/users/${id}/roles`, input);
  return unwrapApiResponse(response.data);
}

export async function getProfile(): Promise<UserProfileDto> {
  const response = await apiClient.get<ApiResponse<UserProfileDto>>("/users/me/profile");
  return unwrapApiResponse(response.data);
}

export async function updateProfile(input: UpdateProfileInput): Promise<UserProfileDto> {
  const response = await apiClient.put<ApiResponse<UserProfileDto>>("/users/me/profile", input);
  return unwrapApiResponse(response.data);
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  await apiClient.put<ApiResponse<object>>("/users/me/password", input);
}
