import { useEffect, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Summary: Slide-over navigation drawer for mobile and tablet viewports. */
export function MobileNavDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: MobileNavDrawerProps): ReactElement | null {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
      <button
        type="button"
        aria-label={t("layout.closeNavigation")}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-border/40 bg-sidebar shadow-2xl",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border/40 px-4 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold tracking-tight text-foreground">{title}</h2>
            {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            aria-label={t("layout.closeNavigation")}
            onClick={onClose}
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60",
              "bg-background/60 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer ? <div className="border-t border-border/40 p-4">{footer}</div> : null}
      </aside>
    </div>,
    document.body,
  );
}
