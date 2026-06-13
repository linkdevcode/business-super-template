import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { createRole } from "../api/roleApi";
import type { CreateRoleInput, RoleDetailDto } from "../types/role";

export function useCreateRole(): UseMutationResult<RoleDetailDto, Error, CreateRoleInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
