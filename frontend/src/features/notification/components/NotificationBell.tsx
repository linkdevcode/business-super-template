import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { Button } from "../../../shared/components/ui/Button";
import { useAuth } from "../../auth";
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications } from "../hooks/useNotifications";
import type { NotificationDto } from "../types/notification";

function formatNotificationTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function NotificationIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 22a2.5 2.5 0 0 0 2.45-2H9.55A2.5 2.5 0 0 0 12 22Zm8-6v-5.5a8 8 0 1 0-16 0V16l-1.7 1.7A1 1 0 0 0 3 19h18a1 1 0 0 0 .7-1.7L20 16Z" />
    </svg>
  );
}

type NotificationItemProps = {
  notification: NotificationDto;
  onRead: (notificationId: string) => void;
};

function NotificationItem({ notification, onRead }: NotificationItemProps): ReactElement {
  const handleRead = (): void => {
    if (!notification.isRead) {
      onRead(notification.id);
    }
  };

  return (
    <div
      className={[
        "rounded-xl border p-3 transition-colors",
        notification.isRead
          ? "border-border bg-card"
          : "border-primary/20 bg-primary/5",
      ].join(" ")}
    >
      <button
        type="button"
        className="block w-full text-left"
        onClick={handleRead}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">{notification.title}</p>
              {!notification.isRead ? (
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
              ) : null}
            </div>
            <p className="text-sm leading-5 text-muted-foreground">{notification.content}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-1 font-medium uppercase tracking-wide text-foreground">
                {notification.type}
              </span>
              <span>{formatNotificationTime(notification.createdAt)}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export function NotificationBell(): ReactElement {
  const { currentUser, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const notificationsQuery = useNotifications({
    userId: currentUser?.id,
    pageSize: 10,
    enabled: isAuthenticated,
  });
  const markNotificationAsReadMutation = useMarkNotificationAsRead();
  const markAllNotificationsAsReadMutation = useMarkAllNotificationsAsRead();
  const hasNextPage = notificationsQuery.hasNextPage;
  const isFetchingNextPage = notificationsQuery.isFetchingNextPage;
  const fetchNextPage = notificationsQuery.fetchNextPage;

  const notifications = useMemo(
    () => notificationsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [notificationsQuery.data],
  );
  const unreadCount = notificationsQuery.data?.pages[0]?.unreadCount ?? 0;
  const isBusy = notificationsQuery.isLoading || markNotificationAsReadMutation.isPending || markAllNotificationsAsReadMutation.isPending;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleMouseDown = (event: MouseEvent): void => {
      const target = event.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !hasNextPage || isFetchingNextPage) {
      return undefined;
    }

    const root = scrollContainerRef.current;
    const target = sentinelRef.current;
    if (!root || !target) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root, threshold: 0.2 },
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isOpen]);

  const toggleOpen = (): void => {
    setIsOpen((currentOpen) => !currentOpen);
  };

  const handleMarkAsRead = (notificationId: string): void => {
    markNotificationAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = (): void => {
    markAllNotificationsAsReadMutation.mutate();
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={toggleOpen}
        className="relative h-10 w-10 rounded-full px-0"
      >
        <NotificationIcon />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-destructive-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </Button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-[22rem] rounded-2xl border border-border bg-popover shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">Latest activity for your account</p>
            </div>
            <Button
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isBusy}
            >
              Mark all as read
            </Button>
          </div>

          <div ref={scrollContainerRef} className="max-h-[28rem] overflow-y-auto p-3">
            {notificationsQuery.isError ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                Failed to load notifications.
              </div>
            ) : notificationsQuery.isLoading ? (
              <div className="space-y-2">
                <div className="h-16 animate-pulse rounded-xl bg-muted" />
                <div className="h-16 animate-pulse rounded-xl bg-muted" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} onRead={handleMarkAsRead} />
                ))}
                <div ref={sentinelRef} className="h-6" aria-hidden="true" />
                {notificationsQuery.isFetchingNextPage ? (
                  <p className="pb-1 text-center text-xs text-muted-foreground">Loading more...</p>
                ) : notificationsQuery.hasNextPage ? (
                  <p className="pb-1 text-center text-xs text-muted-foreground">Scroll to load more</p>
                ) : (
                  <p className="pb-1 text-center text-xs text-muted-foreground">You have reached the end.</p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
