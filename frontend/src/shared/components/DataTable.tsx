import type { ReactElement, ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "./ui/Table";
import { Skeleton } from "./ui/Skeleton";
import { EmptyState } from "./EmptyState";

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
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
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
  emptyTitle,
  emptyDescription,
  emptyAction = null,
}: DataTableProps<TData>): ReactElement {
  const { t } = useTranslation();
  const resolvedEmptyTitle = emptyTitle ?? t("dataTable.noRecords");
  const resolvedEmptyDescription = emptyDescription ?? t("dataTable.noRecordsDescription");

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

  const visibleRows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      {onSearchValueChange ? (
        <div className="flex w-full items-center gap-3">
          <Input
            value={searchValue ?? ""}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder={t("dataTable.search")}
            className="w-full bg-card sm:max-w-sm"
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
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={`skeleton-row-${rowIndex}`}>
                {columns.map((_, columnIndex) => (
                  <TableCell key={`skeleton-cell-${rowIndex}-${columnIndex}`}>
                    <Skeleton className={columnIndex === 0 ? "h-4 w-4/5" : "h-4 w-full"} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : visibleRows.length > 0 ? (
            visibleRows.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? "cursor-pointer" : undefined}
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
              <TableCell colSpan={columns.length} className="p-6">
                <EmptyState
                  title={resolvedEmptyTitle}
                  description={resolvedEmptyDescription}
                  action={emptyAction}
                  className="border-0 bg-transparent px-0 py-0 shadow-none"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {onPageIndexChange || onPageSizeChange ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {t("dataTable.pageOf", { current: pageIndex + 1, total: Math.max(pageCount, 1) })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onPageIndexChange ? (
              <Button
                variant="secondary"
                onClick={() => onPageIndexChange(Math.max(pageIndex - 1, 0))}
                disabled={pageIndex <= 0}
              >
                {t("dataTable.previous")}
              </Button>
            ) : null}
            {onPageIndexChange ? (
              <Button
                variant="secondary"
                onClick={() => onPageIndexChange(pageIndex + 1)}
                disabled={pageIndex + 1 >= pageCount}
              >
                {t("dataTable.next")}
              </Button>
            ) : null}
            {onPageSizeChange ? (
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {t("dataTable.perPage", { size })}
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
