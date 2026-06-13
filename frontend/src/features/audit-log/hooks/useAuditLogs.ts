import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getAuditLogs } from "../api/auditLogApi";
import type { AuditLogPageDto, GetAuditLogsParams } from "../types/auditLog";

export function useAuditLogs(
  params: GetAuditLogsParams,
): UseQueryResult<AuditLogPageDto, Error> {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });
}
