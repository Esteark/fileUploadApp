export interface UploadFile {
  file: File;
  progress: number;
  error?: string;
  createdAt?: string;
  createdBy?: string;
  abortController?: AbortController; // cancelar subida
  status?: "pending" | "uploading" | "completed" | "error" | "cancelled";
}
