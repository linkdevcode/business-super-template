import type { ReactElement, ReactNode } from "react";
import { usePermission } from "../../auth/hooks/useAuth";

type HasPermissionProps = {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
};

/** Summary: Renders content only when the current user has the permission. */
export function HasPermission({
  permission,
  children,
  fallback = null,
}: HasPermissionProps): ReactElement | null {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
