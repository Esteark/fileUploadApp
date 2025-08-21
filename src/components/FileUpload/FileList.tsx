import React, { useContext } from "react";
import { FileUploadContext } from "../../AppContext/FileUploadContext";
import FileRow from "./FileRow";

export default function FileList() {
  const appContext = useContext(FileUploadContext);
  if (!appContext) return null;

  const { uploadedFiles, removeFile } = appContext;

  return (
    <section className="mt-4 max-h-48 overflow-y-auto space-y-3">
      {uploadedFiles.map((file, index) => (
        <FileRow
          key={index}
          file={file}
          index={index}
          removeFile={removeFile}
        />
      ))}
    </section>
  );
}
