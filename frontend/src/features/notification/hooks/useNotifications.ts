import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData, type UseInfiniteQueryResult, type UseMutationResult } from "@tanstack/react-query";
import { getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../api/notificationApi";
import type { GetMyNotificationsResponseDto, NotificationDto } from "../types/notification";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (userId: string | undefined, pageSize: number) =>
    ["notifications", userId ?? "anonymous", "list", pageSize] as const,
};

export interface UseNotificationsOptions {
  userId?: string;
  pageSize?: number;
  enabled?: boolean;
}

export function useNotifications(
  options: UseNotificationsOptions = {},
): UseInfiniteQueryResult<InfiniteData<GetMyNotificationsResponseDto, number>, Error> {
  const { userId, pageSize = 10, enabled = true } = options;

  return useInfiniteQuery({
    queryKey: notificationQueryKeys.list(userId, pageSize),
    queryFn: ({ pageParam = 1 }) => getMyNotifications({ pageNumber: pageParam, pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber >= lastPage.totalPages) {
        return undefined;
      }

      return lastPage.pageNumber + 1;
    },
    enabled,
  });
}

export function useMarkNotificationAsRead(): UseMutationResult<NotificationDto, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export function useMarkAllNotificationsAsRead(): UseMutationResult<void, Error, void, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}
