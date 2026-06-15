import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getUsers, type GetUsersParams } from "../api/userApi";
import type { PagedResponse } from "../../../shared/http/httpTypes";
import type { UserListItemDto } from "../types/user";

export function useUsers(
  params: GetUsersParams,
): UseQueryResult<PagedResponse<UserListItemDto>, Error> {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}
