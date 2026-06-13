export interface FileDto {
  id: string;
  fileName: string;
  storageKey: string;
  contentType: string;
  fileSize: number;
  url: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

export type UploadProgressHandler = (progress: number) => void;
