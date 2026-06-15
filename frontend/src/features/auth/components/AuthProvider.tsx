import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ReactElement } from "react";
import { login as loginRequest, logout as logoutRequest, refreshSession as refreshSessionRequest, getCurrentUser as getCurrentUserRequest } from "../api/authApi";
import type { AuthSessionDto, AuthUserDto, LoginInput } from "../types/auth";
import { clearAccessToken, setAccessToken, subscribeToAccessTokenChanges } from "../../../shared/http/tokenStore";
import { AuthContext, type AuthContextState } from "../context/authContext";

type AuthProviderProps = {
  children: ReactNode;
};

function applySession(nextSession: AuthSessionDto): void {
  setAccessToken(nextSession.accessToken);
}

function createEmptySession(): AuthSessionDto | null {
  return null;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [currentUser, setCurrentUser] = useState<AuthUserDto | null>(null);
  const [session, setSession] = useState<AuthSessionDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback((): void => {
    clearAccessToken();
    setSession(createEmptySession());
    setCurrentUser(null);
  }, []);

  const syncSession = useCallback((nextSession: AuthSessionDto): void => {
    applySession(nextSession);
    setSession(nextSession);
    setCurrentUser(nextSession.user);
  }, []);

  const login = useCallback(
    async (input: LoginInput): Promise<AuthSessionDto> => {
      const nextSession = await loginRequest(input);
      syncSession(nextSession);
      return nextSession;
    },
    [syncSession],
  );

  const refreshSession = useCallback(async (): Promise<AuthSessionDto> => {
    const nextSession = await refreshSessionRequest();
    syncSession(nextSession);
    return nextSession;
  }, [syncSession]);

  const refreshCurrentUser = useCallback(async (): Promise<AuthUserDto> => {
    const nextUser = await getCurrentUserRequest();
    setCurrentUser(nextUser);
    setSession((currentSession) =>
      currentSession
        ? {
            ...currentSession,
            user: nextUser,
          }
        : currentSession,
    );
    return nextUser;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!currentUser) {
        return false;
      }

      return currentUser.permissions.includes(permission);
    },
    [currentUser],
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      if (!currentUser) {
        return false;
      }

      return currentUser.roles.includes(role);
    },
    [currentUser],
  );

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async (): Promise<void> => {
      try {
        const nextSession = await refreshSessionRequest();
        if (isMounted) {
          syncSession(nextSession);
        }
      } catch {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession, syncSession]);

  useEffect(() => {
    const unsubscribe = subscribeToAccessTokenChanges((nextAccessToken) => {
      if (!nextAccessToken) {
        setSession(createEmptySession());
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextState>(
    () => ({
      currentUser,
      session,
      isLoading,
      isAuthenticated: currentUser !== null,
      login,
      logout,
      refreshSession,
      refreshCurrentUser,
      clearSession,
      hasPermission,
      hasRole,
    }),
    [clearSession, currentUser, hasPermission, hasRole, isLoading, login, logout, refreshCurrentUser, refreshSession, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
