import { type ReactNode } from "react";
import type { ReactElement } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  contentClassName?: string;
};

type DialogSectionProps = {
  children: ReactNode;
};

/** Summary: Basic dialog wrapper. */
export function Dialog({
  open,
  onOpenChange,
  children,
  contentClassName = "",
}: DialogProps): ReactElement | null {
  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={[
          "w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** Summary: Dialog header area. */
export function DialogHeader({ children }: DialogSectionProps): ReactElement {
  return <div className="mb-4 space-y-2">{children}</div>;
}

/** Summary: Dialog title element. */
export function DialogTitle({ children }: DialogSectionProps): ReactElement {
  return <h2 className="text-lg font-semibold text-foreground">{children}</h2>;
}

/** Summary: Dialog description element. */
export function DialogDescription({ children }: DialogSectionProps): ReactElement {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

/** Summary: Dialog footer area. */
export function DialogFooter({ children }: DialogSectionProps): ReactElement {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>;
}

/** Summary: Default cancel action for dialogs. */
export function DialogCancel({
  children,
  onClick,
}: DialogSectionProps & { onClick?: () => void }): ReactElement {
  return (
    <Button variant="secondary" onClick={onClick}>
      {children}
    </Button>
  );
}

/** Summary: Default confirm action for dialogs. */
export function DialogConfirm({
  children,
  onClick,
}: DialogSectionProps & { onClick?: () => void }): ReactElement {
  return <Button onClick={onClick}>{children}</Button>;
}
