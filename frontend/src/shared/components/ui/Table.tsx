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
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table
        className={["w-full border-collapse text-sm", className].filter(Boolean).join(" ")}
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
  return <tr className={["border-b border-slate-100", className].filter(Boolean).join(" ")} {...props} />;
}

/** Summary: Table header cell. */
export function TableHeaderCell({ className = "", ...props }: TableCellProps): ReactElement {
  return (
    <th
      className={["px-4 py-3 text-left font-medium text-slate-600", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

/** Summary: Table data cell. */
export function TableCell({ className = "", children, ...props }: TableCellProps): ReactElement {
  return (
    <td className={["px-4 py-3 text-slate-700", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </td>
  );
}
