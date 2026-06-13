import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LogoutPage } from "./pages/LogoutPage";
import { PermissionsPage } from "./pages/PermissionsPage";
import {
  PermissionProtectedRoute,
  ProtectedRoute,
  PublicRoute,
} from "./routes/RouteGuards";

/** Summary: Application router with public, protected, and permission-protected routes. */
export function AppRouter(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/logout" element={<LogoutPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route element={<PermissionProtectedRoute permission="Permission.View" />}>
              <Route path="/permissions" element={<PermissionsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
