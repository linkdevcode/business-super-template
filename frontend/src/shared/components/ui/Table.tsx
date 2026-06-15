import type { HTMLAttributes, ReactNode, TdHTMLAttributes } from "react";
import type { ReactElement } from "react";

type TableProps = HTMLAttributes<HTMLTableElement>;

type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;

type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
};

/** Summary: Basic reusable table component. */
export function Table({ className = "", ...props }: TableProps): ReactElement {
  return (
    <div
      className="w-full overflow-x-auto overscroll-x-contain rounded-xl border border-border bg-card shadow-sm [-webkit-overflow-scrolling:touch]"
    >
      <table
        className={["w-full border-collapse text-sm text-foreground", className].filter(Boolean).join(" ")}
        {...props}
      />
    </div>
  );
}

/** Summary: Table header section. */
export function TableHead({ className = "", ...props }: TableSectionProps): ReactElement {
  return <thead className={className} {...props} />;
}

/** Summary: Table body section. */
export function TableBody({ className = "", ...props }: TableSectionProps): ReactElement {
  return <tbody className={className} {...props} />;
}

/** Summary: Table row. */
export function TableRow({ className = "", ...props }: TableRowProps): ReactElement {
  return <tr className={["border-b border-border/70 transition-colors hover:bg-muted/50", className].filter(Boolean).join(" ")} {...props} />;
}

/** Summary: Table header cell. */
export function TableHeaderCell({ className = "", ...props }: TableCellProps): ReactElement {
  return (
    <th
      className={["px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:px-4", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

/** Summary: Table data cell. */
export function TableCell({ className = "", children, ...props }: TableCellProps): ReactElement {
  return (
    <td className={["px-3 py-3 text-sm text-foreground sm:px-4", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </td>
  );
}
