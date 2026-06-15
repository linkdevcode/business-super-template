import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";
import { cn } from "../../../lib/utils";

type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

/** Summary: Tooltip context provider for the application shell. */
export function TooltipProvider({ delayDuration = 0, ...props }: TooltipProviderProps): ReactElement {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

type TooltipProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

/** Summary: Tooltip root wrapper. */
export function Tooltip(props: TooltipProps): ReactElement {
  return <TooltipPrimitive.Root {...props} />;
}

type TooltipTriggerProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

/** Summary: Element that triggers the tooltip. */
export function TooltipTrigger(props: TooltipTriggerProps): ReactElement {
  return <TooltipPrimitive.Trigger {...props} />;
}

type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

/** Summary: Tooltip content panel. */
export function TooltipContent({ className, sideOffset = 6, ...props }: TooltipContentProps): ReactElement {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

type SimpleTooltipProps = {
  label: string;
  children: ReactNode;
  disabled?: boolean;
};

/** Summary: Convenience tooltip for collapsed sidebar items. */
export function SimpleTooltip({ label, children, disabled = false }: SimpleTooltipProps): ReactElement {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
