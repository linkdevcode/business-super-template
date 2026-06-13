import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ZodType } from "zod";
import { uploadFile } from "../api/fileApi";
import { uploadAvatarSchema, uploadFileSchema } from "../schemas/fileSchemas";
import type { FileDto } from "../types/file";

type UploadFileVariables = File;

function useUploadFileWithSchema(
  schema: ZodType<{ file: File }>,
): {
  upload: (file: File) => Promise<FileDto>;
  progress: number;
  resetProgress: () => void;
  isUploading: boolean;
  error: Error | null;
} {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation<FileDto, Error, UploadFileVariables>({
    mutationFn: async (file) => {
      const parsed = schema.safeParse({ file });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid file.");
      }

      return await uploadFile(file, setProgress);
    },
  });

  const upload = useCallback(
    async (file: File): Promise<FileDto> => {
      setProgress(0);
      return await mutation.mutateAsync(file);
    },
    [mutation],
  );

  const resetProgress = useCallback((): void => {
    setProgress(0);
  }, []);

  return {
    upload,
    progress,
    resetProgress,
    isUploading: mutation.isPending,
    error: mutation.error,
  };
}

export function useUploadFile(): {
  upload: (file: File) => Promise<FileDto>;
  progress: number;
  resetProgress: () => void;
  isUploading: boolean;
  error: Error | null;
} {
  return useUploadFileWithSchema(uploadFileSchema);
}

export function useUploadAvatar(): {
  upload: (file: File) => Promise<FileDto>;
  progress: number;
  resetProgress: () => void;
  isUploading: boolean;
  error: Error | null;
} {
  return useUploadFileWithSchema(uploadAvatarSchema);
}
