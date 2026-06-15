import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";
import { USER_STATUS, type UserStatus } from "../types/user";

type UserStatusBadgeProps = {
  status: string;
  className?: string;
};

export function UserStatusBadge({ status, className }: UserStatusBadgeProps): ReactElement {
  const { t } = useTranslation();
  const normalizedStatus = status.toUpperCase() as UserStatus;
  const isActive = normalizedStatus === USER_STATUS.ACTIVE;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        isActive
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-destructive/30 bg-destructive/10 text-destructive",
        className,
      )}
    >
      {isActive ? t("users.statusActive") : t("users.statusInactive")}
    </span>
  );
}
