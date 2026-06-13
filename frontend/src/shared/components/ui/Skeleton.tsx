import type { HTMLAttributes, ReactElement } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/** Summary: Reusable loading skeleton block. */
export function Skeleton({ className = "", ...props }: SkeletonProps): ReactElement {
  return (
    <div
      aria-hidden="true"
      className={["animate-pulse rounded-md bg-muted", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
