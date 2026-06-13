import type { ReactNode, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePermission, useAuth } from "../hooks/useAuth";
import { HasPermission as PermissionGuard } from "../../permission";
import { Skeleton } from "../../../shared/components/ui/Skeleton";

type GuardProps = {
  children?: ReactNode;
};

type PermissionGuardProps = GuardProps & {
  permission: string;
};

type PermissionProps = GuardProps & {
  permission: string;
  fallback?: ReactNode;
};

function LoadingState(): ReactElement {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

/** Summary: Allows only unauthenticated users. */
export function PublicRoute({ children }: GuardProps): ReactElement {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

/** Summary: Requires a signed-in user. */
export function ProtectedRoute({ children }: GuardProps): ReactElement {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

/** Summary: Requires a signed-in user with a specific permission. */
export function PermissionProtectedRoute({ children, permission }: PermissionGuardProps): ReactElement {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermission();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

/** Summary: Renders content only when the current user has a permission. */
export function HasPermission({ children, permission, fallback = null }: PermissionProps): ReactElement | null {
  return (
    <PermissionGuard permission={permission} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
