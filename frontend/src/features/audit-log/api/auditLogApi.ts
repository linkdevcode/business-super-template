import { apiClient } from "../../../shared/http/axiosClient";
import type { ApiResponse } from "../../../shared/http/httpTypes";
import type { AuditLogPageDto, GetAuditLogsParams } from "../types/auditLog";

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data === null) {
    throw new Error(response.message ?? "Request failed.");
  }

  return response.data;
}

export async function getAuditLogs(params: GetAuditLogsParams): Promise<AuditLogPageDto> {
  const response = await apiClient.get<ApiResponse<AuditLogPageDto>>("/api/audit-logs", {
    params,
  });

  return unwrapApiResponse(response.data);
}
