import { useEffect, useState, type ButtonHTMLAttributes } from "react";
import { useTheme } from "next-themes";
import type { ReactElement } from "react";

type ThemeToggleProps = ButtonHTMLAttributes<HTMLButtonElement>;

function SunIcon(): ReactElement {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0 3a1 1 0 0 1 1-1v-1a1 1 0 1 0-2 0v1a1 1 0 0 1 1 1Zm0-16a1 1 0 0 1 1-1V3a1 1 0 1 0-2 0v1a1 1 0 0 1 1 1Zm8 7a1 1 0 0 1 1-1h1a1 1 0 1 0 0-2h-1a1 1 0 1 0-1 1Zm-18 0a1 1 0 0 1 1-1H4a1 1 0 1 0 0-2H3a1 1 0 1 0-1 1Zm16.95-7.05a1 1 0 0 1 0 1.41l-.7.7a1 1 0 0 0 1.41 1.41l.7-.7a1 1 0 0 1-1.41-1.41Zm-14.2 14.2a1 1 0 0 1 0 1.41l-.7.7a1 1 0 1 0 1.41 1.41l.7-.7a1 1 0 0 1-1.41-1.41Zm14.2 1.41a1 1 0 0 1-1.41 0l-.7-.7a1 1 0 1 0-1.41 1.41l.7.7a1 1 0 1 1 1.41-1.41Zm-14.2-14.2a1 1 0 0 1-1.41 0l-.7-.7A1 1 0 0 0 2.08 5.78l.7.7a1 1 0 0 1 0 1.41Z"
      />
    </svg>
  );
}

function MoonIcon(): ReactElement {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M20.8 14.6A8.8 8.8 0 0 1 9.4 3.2a1 1 0 0 0-1.2 1.2 10.8 10.8 0 1 0 8.2 8.2 1 1 0 0 0-1.2-1.2 8.8 8.8 0 0 1 5.6 3.2Z"
      />
    </svg>
  );
}

export function ThemeToggle({ className = "", ...props }: ThemeToggleProps): ReactElement {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme ?? theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Switch theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {mounted ? (
        <>
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
        </>
      ) : (
        <span className="h-4 w-4 animate-pulse rounded-full bg-muted" />
      )}
    </button>
  );
}
