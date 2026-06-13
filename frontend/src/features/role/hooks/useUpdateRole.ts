import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { updateRole } from "../api/roleApi";
import type { RoleDetailDto, UpdateRoleInput } from "../types/role";

export function useUpdateRole(): UseMutationResult<
  RoleDetailDto,
  Error,
  { id: string; input: UpdateRoleInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }) => updateRole(id, input),
    onSuccess: async (role) => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      await queryClient.setQueryData(["roles", role.id], role);
    },
  });
}
