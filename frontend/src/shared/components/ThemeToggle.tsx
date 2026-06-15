import { useEffect, useState, type ButtonHTMLAttributes } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import type { ReactElement } from "react";
import { cn } from "../../lib/utils";

type ThemeToggleProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ThemeToggle({ className = "", ...props }: ThemeToggleProps): ReactElement {
  const { t } = useTranslation();
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
      aria-label={mounted ? (isDark ? t("theme.switchToLight") : t("theme.switchToDark")) : t("theme.switchTheme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm",
        "transition-all duration-200 hover:bg-muted/60 hover:text-foreground hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    >
      {mounted ? (
        isDark ? (
          <Sun size={18} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Moon size={18} strokeWidth={1.75} aria-hidden="true" />
        )
      ) : (
        <span className="h-[18px] w-[18px] animate-pulse rounded-full bg-muted" />
      )}
    </button>
  );
}
