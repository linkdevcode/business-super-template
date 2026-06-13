import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getFile } from "../api/fileApi";
import type { FileDto } from "../types/file";

export function useFile(id: string | null): UseQueryResult<FileDto, Error> {
  return useQuery({
    queryKey: ["files", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("File id is required.");
      }

      return await getFile(id);
    },
    enabled: Boolean(id),
  });
}
