import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { deleteRole } from "../api/roleApi";

export function useDeleteRole(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
