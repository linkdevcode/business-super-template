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
        "h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
});
