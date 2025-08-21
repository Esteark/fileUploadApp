import toast from "react-hot-toast";
import { MAX_FILE_SIZE, MAX_FILES } from "./constants";
import type { UploadFile } from "../types";

export const validateFiles = (
  files: File[],
  uploadedFiles: UploadFile[]
): UploadFile[] => {
  const newFiles: UploadFile[] = [];
  const errors: string[] = [];

  files.forEach((file) => {
    const alreadyExists = uploadedFiles.some(
      (f) =>
        f.file.name === file.name &&
        f.file.size === file.size &&
        f.file.type === file.type
    );

    if (alreadyExists) {
      errors.push(`⚠️ ${file.name} ya fue cargado anteriormente`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      newFiles.push({ file, progress: 0, error: "El archivo supera los 5MB" });
      errors.push(`❌ ${file.name} supera los 5MB`);
    } else {
      newFiles.push({
        file,
        progress: 0,
        createdAt: new Date().toLocaleDateString(),
        createdBy: "UserFile",
      });
    }
  });

  if (errors.length > 0) errors.forEach((err) => toast.error(err));

  const totalFiles = uploadedFiles.length + newFiles.length;
  if (totalFiles > MAX_FILES) {
    toast.error("⚠️ Solo puedes subir un máximo de 10 archivos.");
    return newFiles.slice(0, MAX_FILES - uploadedFiles.length);
  }

  return newFiles;
};
