import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { saveSystemSettings } from "../api/systemSettingsApi";
import type { SaveSystemSettingsInput, SystemSettingDto } from "../types/systemSettings";

export function useUpdateSystemSettings(): UseMutationResult<
  SystemSettingDto,
  Error,
  SaveSystemSettingsInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSystemSettings,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      await queryClient.setQueryData(["system-settings", result.key], result);
    },
  });
}
