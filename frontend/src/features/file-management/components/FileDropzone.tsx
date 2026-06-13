import { useRef, useState, type DragEvent, type ReactElement } from "react";
import { Button } from "../../../shared/components/ui/Button";
import { useUploadFile } from "../hooks/useUploadFile";
import type { FileDto } from "../types/file";

type FileDropzoneProps = {
  title?: string;
  description?: string;
  accept?: string;
  disabled?: boolean;
  buttonLabel?: string;
  onUploaded?: (file: FileDto) => void;
  onError?: (error: Error) => void;
  className?: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDropzone({
  title = "Upload file",
  description = "Drag and drop a file here or choose one from your device.",
  accept = "*/*",
  disabled = false,
  buttonLabel = "Choose file",
  onUploaded,
  onError,
  className = "",
}: FileDropzoneProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<number | null>(null);
  const { upload, progress, isUploading, resetProgress } = useUploadFile();

  const openFilePicker = (): void => {
    inputRef.current?.click();
  };

  const handleFiles = async (fileList: FileList | null): Promise<void> => {
    const file = fileList?.item(0);
    if (!file || disabled) {
      return;
    }

    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);
    setStatusMessage(null);

    try {
      const uploadedFile = await upload(file);
      setStatusMessage("Upload completed successfully.");
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
          "rounded-2xl border border-dashed p-6 transition-colors",
          isDragging ? "border-primary bg-muted/60" : "border-border bg-card",
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
        <div className="space-y-2 text-center">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {selectedFileName ? (
            <p className="text-xs text-muted-foreground">
              Selected: {selectedFileName}
              {selectedFileSize !== null ? ` (${formatBytes(selectedFileSize)})` : ""}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex justify-center">
          <Button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openFilePicker();
            }}
            disabled={disabled || isUploading}
          >
            {isUploading ? "Uploading..." : buttonLabel}
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
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {statusMessage ? <p className="text-sm text-muted-foreground">{statusMessage}</p> : null}
    </div>
  );
}
