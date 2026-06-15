import { useEffect, useRef, useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { cn } from "../../lib/utils";

type UserProfileMenuProps = {
  fullName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  avatarLabel: string;
};

/** Summary: Admin profile dropdown for the application header. */
export function UserProfileMenu({ fullName, email, avatarUrl, avatarLabel }: UserProfileMenuProps): ReactElement {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleMouseDown = (event: MouseEvent): void => {
      const target = event.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/80 px-2 py-1.5",
          "shadow-sm transition-all duration-200 hover:bg-muted/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isOpen && "bg-muted/60",
        )}
      >
        <Avatar className="h-8 w-8">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName ?? t("common.admin")} /> : null}
          <AvatarFallback className="text-xs">{avatarLabel}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-none text-foreground">{fullName ?? t("common.admin")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{email ?? t("common.signedInUser")}</p>
        </div>
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className={cn("hidden text-muted-foreground transition-transform duration-200 sm:block", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(18rem,calc(100vw-1.5rem))] rounded-xl border border-border bg-popover p-2 shadow-lg sm:w-72">
          <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName ?? t("common.admin")} /> : null}
                <AvatarFallback>{avatarLabel}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{fullName ?? t("common.admin")}</p>
                <p className="truncate text-xs text-muted-foreground">{email ?? t("common.signedInUser")}</p>
              </div>
            </div>
          </div>

          <div className="my-2 h-px bg-border" />

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <UserRound size={16} strokeWidth={1.75} aria-hidden="true" />
            {t("nav.profile")}
          </Link>

          <div className="my-2 h-px bg-border" />

          <Link
            to="/logout"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-full items-center justify-center rounded-lg border border-border bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
          >
            {t("common.signOut")}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
