import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { changePassword } from "../api/userApi";
import type { ChangePasswordInput } from "../types/user";

export function useChangePassword(): UseMutationResult<void, Error, ChangePasswordInput> {
  return useMutation({
    mutationFn: changePassword,
  });
}
