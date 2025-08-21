export interface UploadFile {
  file: File;
  progress: number;
  error?: string;
  createdAt?: string;
  createdBy?: string;
  abortController?: AbortController; // cancelar subida
  status?: "pending" | "uploading" | "completed" | "error" | "cancelled";
}

export interface FilePayload {
  id: string;
  name: string;
  type: string;
  size: string;
  createdAt: string;
  createdBy: string;
  tag: string;
}
