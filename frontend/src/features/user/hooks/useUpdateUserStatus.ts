import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { updateUserStatus } from "../api/userApi";
import type { UpdateUserStatusInput, UserDetailDto } from "../types/user";

type UpdateUserStatusVariables = {
  id: string;
  input: UpdateUserStatusInput;
};

export function useUpdateUserStatus(): UseMutationResult<UserDetailDto, Error, UpdateUserStatusVariables> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }) => updateUserStatus(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
