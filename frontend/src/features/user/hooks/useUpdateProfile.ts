import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { updateProfile } from "../api/userApi";
import type { UpdateProfileInput, UserProfileDto } from "../types/user";

export function useUpdateProfile(): UseMutationResult<UserProfileDto, Error, UpdateProfileInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
