import { useCallback, useState } from "react";

export const SIDEBAR_COLLAPSED_STORAGE_KEY = "my-super-template-sidebar-collapsed";

function readStoredCollapsedState(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
}

type UseSidebarCollapsedResult = {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
};

/** Summary: Persists admin sidebar collapsed state in localStorage. */
export function useSidebarCollapsed(): UseSidebarCollapsedResult {
  const [isCollapsed, setIsCollapsed] = useState(readStoredCollapsedState);

  const setCollapsed = useCallback((value: boolean): void => {
    setIsCollapsed(value);
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(value));
  }, []);

  const toggleCollapsed = useCallback((): void => {
    setIsCollapsed((previous) => {
      const next = !previous;
      localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return {
    isCollapsed,
    toggleCollapsed,
    setCollapsed,
  };
}
