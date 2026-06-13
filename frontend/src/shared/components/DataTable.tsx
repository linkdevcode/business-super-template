import type { ReactElement } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "./ui/Table";

type DataTableProps<TData> = {
  columns: Array<ColumnDef<TData, unknown>>;
  data: TData[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onPageIndexChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  emptyMessage?: string;
};

/** Summary: Generic table component for CRUD lists. */
export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  searchValue,
  onSearchValueChange,
  pageIndex = 0,
  pageSize = 10,
  pageCount = 0,
  sorting,
  onSortingChange,
  onPageIndexChange,
  onPageSizeChange,
  emptyMessage = "No records found.",
}: DataTableProps<TData>): ReactElement {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
    },
    onSortingChange,
  });

  return (
    <div className="space-y-4">
      {onSearchValueChange ? (
        <div className="flex items-center gap-3">
          <Input
            value={searchValue ?? ""}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder="Search..."
            className="max-w-sm"
          />
        </div>
      ) : null}

      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeaderCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>Loading...</TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? "cursor-pointer hover:bg-slate-50" : undefined}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>{emptyMessage}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {onPageIndexChange || onPageSizeChange ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            Page {pageIndex + 1} of {Math.max(pageCount, 1)}
          </div>
          <div className="flex items-center gap-2">
            {onPageIndexChange ? (
              <Button
                variant="secondary"
                onClick={() => onPageIndexChange(Math.max(pageIndex - 1, 0))}
                disabled={pageIndex <= 0}
              >
                Previous
              </Button>
            ) : null}
            {onPageIndexChange ? (
              <Button
                variant="secondary"
                onClick={() => onPageIndexChange(pageIndex + 1)}
                disabled={pageIndex + 1 >= pageCount}
              >
                Next
              </Button>
            ) : null}
            {onPageSizeChange ? (
              <select
                className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
