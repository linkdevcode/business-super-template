import { apiClient } from "../../../shared/http/axiosClient";
import type { ApiResponse } from "../../../shared/http/httpTypes";
import type {
  GetMyNotificationsParams,
  GetMyNotificationsResponseDto,
  NotificationDto,
} from "../types/notification";

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data === null) {
    throw new Error(response.message ?? "Request failed.");
  }

  return response.data;
}

export async function getMyNotifications(
  params: GetMyNotificationsParams = {},
): Promise<GetMyNotificationsResponseDto> {
  const response = await apiClient.get<ApiResponse<GetMyNotificationsResponseDto>>("/api/notifications", {
    params,
  });

  return unwrapApiResponse(response.data);
}

export async function markNotificationAsRead(id: string): Promise<NotificationDto> {
  const response = await apiClient.patch<ApiResponse<NotificationDto>>(`/api/notifications/${id}/read`);
  return unwrapApiResponse(response.data);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch<ApiResponse<object>>("/api/notifications/read-all");
}
