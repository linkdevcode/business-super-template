import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getRoles, type GetRolesParams } from "../api/roleApi";
import type { PagedResponse } from "../../../shared/http/httpTypes";
import type { RoleListItemDto } from "../types/role";

export function useRoles(
  params: GetRolesParams,
): UseQueryResult<PagedResponse<RoleListItemDto>, Error> {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => getRoles(params),
  });
}
