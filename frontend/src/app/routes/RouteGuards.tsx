import { type ReactNode } from "react";
import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../shared/http/tokenStore";

type GuardProps = {
  children?: ReactNode;
  permission?: string;
};

function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

/** Summary: Allows access only to unauthenticated users. */
export function PublicRoute({ children }: GuardProps): ReactElement {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

/** Summary: Requires an authenticated user. */
export function ProtectedRoute({ children }: GuardProps): ReactElement {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

/** Summary: Requires an authenticated user and a target permission. */
export function PermissionProtectedRoute({ children, permission }: GuardProps): ReactElement {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (permission && permission.trim().length === 0) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}
