import React, { useContext } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { GrDocumentDownload } from "react-icons/gr";
import { FileUploadContext } from "../../AppContext/FileUploadContext";

export default function DropZone() {
  const appContext = useContext(FileUploadContext);
  if (!appContext) return null;

  const {
    isFileOverZone,
    onFileEnterZone,
    onFileLeaveZone,
    onFileOverZone,
    onFilesDropped,
    onFileInputChange,
  } = appContext;

  const dropZoneClasses = `
    relative p-8 border-2 rounded-lg text-center cursor-pointer 
    transition-all duration-500 
    ${
      isFileOverZone
        ? "border-mainDark bg-blue-50 border-solid scale-105 shadow-lg"
        : "border-mainDark bg-gray-50 border-dashed hover:bg-gray-100"
    }
  `;

  return (
    <section
      role="button"
      className={dropZoneClasses}
      onDragEnter={onFileEnterZone}
      onDragLeave={onFileLeaveZone}
      onDragOver={onFileOverZone}
      onDrop={onFilesDropped}
    >
      {isFileOverZone ? (
        <div className="text-mainDark flex flex-col items-center gap-2">
          <GrDocumentDownload className="text-3xl" />
          <p className="text-base font-medium">¡Suelta los archivos aquí!</p>
          <p className="text-sm">Se cargarán automáticamente</p>
        </div>
      ) : (
        <div className="text-mainDark flex flex-col items-center gap-1">
          <FiUploadCloud className="text-3xl" />
          <p className="text-base">
            Arrastra tus archivos aquí o haz clic para seleccionar
          </p>
          <p className="text-sm">Máximo tamaño por archivo es de 5MB</p>
        </div>
      )}
      <input
        type="file"
        multiple
        onChange={onFileInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </section>
  );
}
