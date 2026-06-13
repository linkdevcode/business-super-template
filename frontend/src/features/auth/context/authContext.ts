import { createContext } from "react";
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

export const AuthContext = createContext<AuthContextState | undefined>(undefined);
