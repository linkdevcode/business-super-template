export const AUDIT_LOG_ACTIONS = {
  Create: "CREATE",
  Update: "UPDATE",
  Delete: "DELETE",
} as const;

export type AuditLogAction =
  (typeof AUDIT_LOG_ACTIONS)[keyof typeof AUDIT_LOG_ACTIONS];

export interface AuditLogListItemDto {
  id: string;
  tableName: string;
  recordId: string;
  action: AuditLogAction | string;
  userId: string | null;
  changes: string;
  createdAt: string;
}

export interface AuditLogPageDto {
  items: AuditLogListItemDto[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface GetAuditLogsParams {
  pageNumber: number;
  pageSize: number;
  tableName?: string;
  userId?: string;
  action?: AuditLogAction | "";
}
