import React, { createContext, useState, useEffect, useRef } from "react";
import type { UploadFile } from "../components/types";
import { validateFiles } from "../components/utils/fileValidation";

interface FileUploadContextType {
  isFileOverZone: boolean;
  uploadedFiles: UploadFile[];
  formikRef: React.RefObject<any>;
  onFileEnterZone: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileLeaveZone: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileOverZone: (e: React.DragEvent<HTMLDivElement>) => void;
  onFilesDropped: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  allUploadsComplete: boolean;
  clearFiles: () => void;
}

export const FileUploadContext = createContext<FileUploadContextType | null>(
  null
);

export const FileUploadProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isFileOverZone, setIsFileOverZone] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [enterEventCount, setEnterEventCount] = useState(0);
  const formikRef = useRef<any>(null);

  // Handlers
  const onFileEnterZone = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEnterEventCount((c) => c + 1);
    setIsFileOverZone(true);
  };

  const onFileLeaveZone = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEnterEventCount((c) => {
      const newCount = c - 1;
      if (newCount === 0) setIsFileOverZone(false);
      return newCount;
    });
  };

  const onFileOverZone = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const onFilesDropped = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileOverZone(false);
    setEnterEventCount(0);

    const dropped = e.dataTransfer.files;
    if (dropped.length > 0) {
      const validated = validateFiles(Array.from(dropped), uploadedFiles);
      setUploadedFiles((prev) => [...prev, ...validated]);
      e.dataTransfer.clearData();
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) {
      const validated = validateFiles(Array.from(selected), uploadedFiles);
      setUploadedFiles((prev) => [...prev, ...validated]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (formikRef.current) {
      const currentFiles = formikRef.current.values.files;
      const newFiles = currentFiles.filter((_: any, i: number) => i !== index);
      formikRef.current.setFieldValue("files", newFiles);
    }
  };

  // Simular progreso
  useEffect(() => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.error
            ? file
            : file.progress < 100
            ? { ...file, progress: file.progress + 1 }
            : file
        )
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const allUploadsComplete =
    uploadedFiles.length > 0 &&
    uploadedFiles.every((f) => f.progress === 100 || f.error);

  const clearFiles = () => {
    setUploadedFiles([]);
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  const context = {
    isFileOverZone,
    uploadedFiles,
    formikRef,
    onFileEnterZone,
    onFileLeaveZone,
    onFileOverZone,
    onFilesDropped,
    onFileInputChange,
    removeFile,
    allUploadsComplete,
    clearFiles,
  };

  return (
    <FileUploadContext.Provider value={context}>
      {children}
    </FileUploadContext.Provider>
  );
};
