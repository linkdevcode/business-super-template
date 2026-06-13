import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getRole } from "../api/roleApi";
import type { RoleDetailDto } from "../types/role";

export function useRole(id: string | null): UseQueryResult<RoleDetailDto, Error> {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Role id is required.");
      }

      return getRole(id);
    },
    enabled: Boolean(id),
  });
}
