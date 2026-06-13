import type { ReactNode, HTMLAttributes } from "react";
import type { ReactElement } from "react";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  className = "",
  ...props
}: EmptyStateProps): ReactElement {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
        {icon ?? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
            <path
              fill="currentColor"
              d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 2a7 7 0 0 1 6.15 3.63l-9.52 9.52A7 7 0 0 1 12 5Zm0 14a7 7 0 0 1-6.15-3.63l9.52-9.52A7 7 0 0 1 12 19Z"
            />
          </svg>
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
