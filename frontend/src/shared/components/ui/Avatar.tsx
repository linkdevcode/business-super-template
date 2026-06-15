import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentPropsWithoutRef, ReactElement } from "react";
import { cn } from "../../../lib/utils";

type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;

/** Summary: Root avatar container. */
export function Avatar({ className, ...props }: AvatarProps): ReactElement {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted",
        className,
      )}
      {...props}
    />
  );
}

type AvatarImageProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;

/** Summary: Avatar image element. */
export function AvatarImage({ className, ...props }: AvatarImageProps): ReactElement {
  return <AvatarPrimitive.Image className={cn("aspect-square h-full w-full object-cover", className)} {...props} />;
}

type AvatarFallbackProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;

/** Summary: Avatar fallback when image is unavailable. */
export function AvatarFallback({ className, ...props }: AvatarFallbackProps): ReactElement {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex h-full w-full items-center justify-center bg-secondary text-sm font-semibold tracking-wide text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}
