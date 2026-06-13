import { useEffect, useRef, useState, type DragEvent, type ReactElement } from "react";
import { Button } from "../../../shared/components/ui/Button";
import { useUploadAvatar } from "../hooks/useUploadFile";
import type { FileDto } from "../types/file";

type AvatarUploaderProps = {
  initialUrl?: string | null;
  alt?: string;
  accept?: string;
  disabled?: boolean;
  onUploaded?: (file: FileDto) => void;
  onError?: (error: Error) => void;
  className?: string;
};

export function AvatarUploader({
  initialUrl = null,
  alt = "Avatar preview",
  accept = "image/*",
  disabled = false,
  onUploaded,
  onError,
  className = "",
}: AvatarUploaderProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { upload, progress, isUploading, resetProgress } = useUploadAvatar();

  useEffect(() => {
    setPreviewUrl(initialUrl);
  }, [initialUrl]);

  const openFilePicker = (): void => {
    inputRef.current?.click();
  };

  const handleFiles = async (fileList: FileList | null): Promise<void> => {
    const file = fileList?.item(0);
    if (!file || disabled) {
      return;
    }

    setStatusMessage(null);

    try {
      const uploadedFile = await upload(file);
      setPreviewUrl(uploadedFile.url);
      setStatusMessage("Avatar uploaded successfully.");
      onUploaded?.(uploadedFile);
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error("Upload failed.");
      setStatusMessage(normalizedError.message);
      onError?.(normalizedError);
    } finally {
      resetProgress();
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault();
    setIsDragging(false);
    await handleFiles(event.dataTransfer.files);
  };

  return (
    <div className={["space-y-4", className].filter(Boolean).join(" ")}>
      <div
        className={[
          "flex flex-col items-center gap-4 rounded-xl border border-dashed p-6 transition-colors",
          isDragging ? "border-slate-900 bg-slate-50" : "border-slate-300 bg-white",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={disabled ? undefined : openFilePicker}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (disabled) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFilePicker();
          }
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {previewUrl ? (
              <img src={previewUrl} alt={alt} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-slate-500">Avatar</span>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-slate-900">Upload avatar</h3>
            <p className="text-sm text-slate-600">Click or drag an image to replace the current avatar.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openFilePicker();
            }}
            disabled={disabled || isUploading}
            variant="secondary"
          >
            {isUploading ? "Uploading..." : "Choose image"}
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={async (event) => await handleFiles(event.target.files)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-900 transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {statusMessage ? <p className="text-sm text-slate-600">{statusMessage}</p> : null}
    </div>
  );
}
