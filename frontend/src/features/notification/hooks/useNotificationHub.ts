import { useEffect, useRef } from "react";
import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../../auth";
import { appConfig } from "../../../shared/config/appConfig";
import { getAccessToken } from "../../../shared/http/tokenStore";
import type { NotificationDto } from "../types/notification";
import { notificationQueryKeys } from "./useNotifications";

function showNotificationToast(notification: NotificationDto): void {
  const message = notification.content.trim();
  const title = notification.title.trim();

  if (notification.type === "Error") {
    toast.error(title, { description: message });
    return;
  }

  if (notification.type === "Success") {
    toast.success(title, { description: message });
    return;
  }

  toast(title, { description: message });
}

export function useNotificationHub(): void {
  const { currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      if (connectionRef.current) {
        void connectionRef.current.stop();
        connectionRef.current = null;
      }

      return undefined;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      return undefined;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${appConfig.apiBaseUrl}/hubs/notifications`, {
        accessTokenFactory: () => getAccessToken() ?? "",
      })
      .withAutomaticReconnect()
      .build();

    let cancelled = false;

    const handleNotification = (notification: NotificationDto): void => {
      showNotificationToast(notification);
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    };

    connection.on("ReceiveNotification", handleNotification);
    connection.onreconnected(() => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    });

    void connection
      .start()
      .then(() => {
        if (cancelled) {
          void connection.stop();
          return;
        }

        connectionRef.current = connection;
      })
      .catch((error: unknown) => {
        console.error("Failed to connect notification hub.", error);
      });

    return () => {
      cancelled = true;
      connection.off("ReceiveNotification", handleNotification);
      void connection.stop();

      if (connectionRef.current === connection) {
        connectionRef.current = null;
      }
    };
  }, [currentUser?.id, isAuthenticated, queryClient]);
}
