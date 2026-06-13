import type { ReactElement } from "react";
import { useNotificationHub } from "../hooks/useNotificationHub";

/** Wires the notification SignalR connection into the authenticated app shell. */
export function NotificationHubBridge(): ReactElement | null {
  useNotificationHub();
  return null;
}
