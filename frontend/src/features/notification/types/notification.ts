export type NotificationType = "Info" | "Success" | "Warning" | "Error";

export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  readAt: string | null;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetMyNotificationsParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface GetMyNotificationsResponseDto {
  items: NotificationDto[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  unreadCount: number;
}
