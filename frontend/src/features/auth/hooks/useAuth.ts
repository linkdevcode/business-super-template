import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import type { AuthUserDto } from "../types/auth";
import type { AuthContextState } from "../context/authContext";

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

export function useCurrentUser(): { currentUser: AuthUserDto | null; isLoading: boolean } {
  const { currentUser, isLoading } = useAuth();
  return { currentUser, isLoading };
}

export function usePermission(): {
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  currentUser: AuthUserDto | null;
  isLoading: boolean;
} {
  const { hasPermission, hasRole, currentUser, isLoading } = useAuth();
  return { hasPermission, hasRole, currentUser, isLoading };
}
