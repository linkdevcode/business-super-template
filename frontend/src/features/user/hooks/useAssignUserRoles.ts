import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { assignUserRoles } from "../api/userApi";
import type { AssignUserRolesInput, UserDetailDto } from "../types/user";

type AssignUserRolesVariables = {
  id: string;
  input: AssignUserRolesInput;
};

export function useAssignUserRoles(): UseMutationResult<UserDetailDto, Error, AssignUserRolesVariables> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }) => assignUserRoles(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
