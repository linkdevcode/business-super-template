import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { deleteFile } from "../api/fileApi";

export function useDeleteFile(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
