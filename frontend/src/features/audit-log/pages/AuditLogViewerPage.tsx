import { useMemo, useState, type ReactElement } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { DataTable } from "../../../shared/components/DataTable";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { AuditLogDetailDialog } from "../components/AuditLogDetailDialog";
import { useAuditLogs } from "../hooks/useAuditLogs";
import {
  AUDIT_LOG_ACTIONS,
  type AuditLogAction,
  type AuditLogListItemDto,
} from "../types/auditLog";

const DEFAULT_PAGE_SIZE = 10;

/** Summary: Audit log viewer page. */
export function AuditLogViewerPage(): ReactElement {
  const { t } = useTranslation();
  const [tableName, setTableName] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState<AuditLogAction | "">("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedLog, setSelectedLog] = useState<AuditLogListItemDto | null>(null);

  const queryParams = useMemo(
    () => ({
      pageNumber: pageIndex + 1,
      pageSize,
      tableName: tableName.trim() || undefined,
      userId: isUuid(userId.trim()) ? userId.trim() : undefined,
      action: action || undefined,
    }),
    [action, pageIndex, pageSize, tableName, userId],
  );

  const auditLogsQuery = useAuditLogs(queryParams);

  const columns: Array<ColumnDef<AuditLogListItemDto, unknown>> = useMemo(
    () => [
      {
        accessorKey: "tableName",
        header: t("auditLog.columns.table"),
      },
      {
        accessorKey: "recordId",
        header: t("auditLog.columns.recordId"),
      },
      {
        accessorKey: "action",
        header: t("auditLog.columns.action"),
      },
      {
        accessorKey: "userId",
        header: t("auditLog.columns.userId"),
        cell: ({ row }) => row.original.userId ?? "-",
      },
      {
        accessorKey: "createdAt",
        header: t("auditLog.columns.createdAt"),
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
    ],
    [t],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("auditLog.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("auditLog.description")}</p>
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            setTableName("");
            setUserId("");
            setAction("");
            setPageIndex(0);
            setSelectedLog(null);
          }}
        >
          {t("auditLog.clearFilters")}
        </Button>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm md:grid-cols-3">
        <label className="space-y-2">
          <span className="block text-sm font-medium text-foreground">{t("auditLog.tableName")}</span>
          <Input
            value={tableName}
            onChange={(event) => {
              setTableName(event.target.value);
              setPageIndex(0);
            }}
            placeholder="User"
          />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-foreground">{t("auditLog.userId")}</span>
          <Input
            value={userId}
            onChange={(event) => {
              setUserId(event.target.value);
              setPageIndex(0);
            }}
            placeholder="UUID"
          />
          <span className="block text-xs text-muted-foreground">{t("auditLog.userIdHint")}</span>
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-foreground">{t("auditLog.action")}</span>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            value={action}
            onChange={(event) => {
              setAction(event.target.value as AuditLogAction | "");
              setPageIndex(0);
            }}
          >
            <option value="">{t("auditLog.allActions")}</option>
            <option value={AUDIT_LOG_ACTIONS.Create}>{t("auditLog.actions.create")}</option>
            <option value={AUDIT_LOG_ACTIONS.Update}>{t("auditLog.actions.update")}</option>
            <option value={AUDIT_LOG_ACTIONS.Delete}>{t("auditLog.actions.delete")}</option>
          </select>
        </label>
      </div>

      <DataTable
        columns={columns}
        data={auditLogsQuery.data?.items ?? []}
        isLoading={auditLogsQuery.isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={auditLogsQuery.data?.totalPages ?? 0}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPageIndex(0);
        }}
        onRowClick={setSelectedLog}
        emptyTitle={t("auditLog.emptyTitle")}
        emptyDescription={t("auditLog.emptyDescription")}
      />

      <AuditLogDetailDialog
        log={selectedLog}
        open={selectedLog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLog(null);
          }
        }}
      />
    </section>
  );
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}
