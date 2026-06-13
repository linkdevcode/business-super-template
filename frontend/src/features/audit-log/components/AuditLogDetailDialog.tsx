import type { ReactElement } from "react";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/Dialog";
import { Button } from "../../../shared/components/ui/Button";
import type { AuditLogListItemDto } from "../types/auditLog";

type AuditLogDetailDialogProps = {
  log: AuditLogListItemDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Summary: Displays audit log before/after JSON details. */
export function AuditLogDetailDialog({
  log,
  open,
  onOpenChange,
}: AuditLogDetailDialogProps): ReactElement {
  const payload = log ? parseChanges(log.changes) : { before: null, after: null };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} contentClassName="!max-w-5xl">
      <DialogHeader>
        <DialogTitle>Audit log details</DialogTitle>
        <DialogDescription>
          Review the before and after payloads captured for this record.
        </DialogDescription>
      </DialogHeader>

      {log ? (
        <div className="grid gap-4 md:grid-cols-2">
          <JsonPanel title="Dữ liệu cũ" value={payload.before} />
          <JsonPanel title="Dữ liệu mới" value={payload.after} />
        </div>
      ) : null}

      <DialogFooter>
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function JsonPanel({
  title,
  value,
}: {
  title: string;
  value: unknown;
}): ReactElement {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words px-4 py-4 text-xs text-slate-700">
        {formatJsonValue(value)}
      </pre>
    </div>
  );
}

function parseChanges(changes: string): { before: unknown; after: unknown } {
  try {
    const parsed: unknown = JSON.parse(changes);
    if (isRecord(parsed)) {
      return {
        before: "before" in parsed ? parsed.before : null,
        after: "after" in parsed ? parsed.after : null,
      };
    }
  } catch {
    return { before: changes, after: changes };
  }

  return { before: null, after: null };
}

function formatJsonValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
