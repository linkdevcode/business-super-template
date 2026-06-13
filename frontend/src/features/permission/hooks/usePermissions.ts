import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPermissions } from "../api/permissionApi";
import type { PermissionGroupDto } from "../types/permission";

export function usePermissions(): UseQueryResult<PermissionGroupDto[], Error> {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });
}
