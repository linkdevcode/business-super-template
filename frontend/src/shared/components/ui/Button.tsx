import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ReactElement } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:opacity-90",
  secondary: "border border-border bg-secondary text-secondary-foreground hover:bg-accent",
  ghost: "border border-transparent bg-transparent text-foreground hover:bg-accent",
  danger:
    "border border-transparent bg-destructive text-destructive-foreground shadow-sm hover:opacity-90",
};

/** Summary: Basic reusable button component. */
export function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps): ReactElement {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
