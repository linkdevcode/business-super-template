import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";
import type { AuthSessionDto, AuthUserDto, LoginInput } from "../types/auth";

export type AuthContextState = {
  currentUser: AuthUserDto | null;
  session: AuthSessionDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<AuthSessionDto>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthSessionDto>;
  clearSession: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
};

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
