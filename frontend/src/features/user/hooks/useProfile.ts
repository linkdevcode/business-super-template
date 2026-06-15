import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getProfile } from "../api/userApi";
import type { UserProfileDto } from "../types/user";

export function useProfile(): UseQueryResult<UserProfileDto, Error> {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}
