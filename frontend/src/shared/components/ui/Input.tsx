import { forwardRef, type InputHTMLAttributes, type ReactElement } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/** Summary: Basic reusable input component. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", ...props }: InputProps,
  ref,
): ReactElement {
  return (
    <input
      ref={ref}
      className={[
        "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
});
