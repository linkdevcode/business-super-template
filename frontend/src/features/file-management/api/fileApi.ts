import { apiClient } from "../../../shared/http/axiosClient";
import type { ApiResponse } from "../../../shared/http/httpTypes";
import type { FileDto, UploadProgressHandler } from "../types/file";

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data === null) {
    throw new Error(response.message ?? "Request failed.");
  }

  return response.data;
}

export async function uploadFile(
  file: File,
  onUploadProgress?: UploadProgressHandler,
): Promise<FileDto> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<FileDto>>("/api/files/upload", formData, {
    onUploadProgress: (event) => {
      if (!onUploadProgress) {
        return;
      }

      if (!event.total || event.total <= 0) {
        onUploadProgress(0);
        return;
      }

      const progress = Math.round((event.loaded / event.total) * 100);
      onUploadProgress(Math.min(Math.max(progress, 0), 100));
    },
  });

  return unwrapApiResponse(response.data);
}

export async function deleteFile(id: string): Promise<void> {
  const response = await apiClient.delete<ApiResponse<object>>(`/api/files/${id}`);
  unwrapApiResponse(response.data);
}

export async function getFile(id: string): Promise<FileDto> {
  const response = await apiClient.get<ApiResponse<FileDto>>(`/api/files/${id}`);
  return unwrapApiResponse(response.data);
}
