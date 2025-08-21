import { IoIosCloseCircle } from "react-icons/io";
import type { UploadFile } from "../types";
import { getFileIcon } from "../utils/fileIcons";

interface Props {
  file: UploadFile;
  index: number;
  removeFile: (index: number) => void;
}

export default function FileRow({ file, index, removeFile }: Props) {
  return (
    <div
      className={`relative flex items-center justify-between p-3 gap-3 border rounded-md shadow-sm transition-all 
      ${file.error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
    >
      <div className="flex items-center gap-3 w-full py-3 px-2">
        {getFileIcon(file.file)}
        <div className="flex flex-col gap-1 w-full">
          <span className="text-sm font-medium">{file.file.name}</span>
          <span className="text-xs text-gray-500">
            {(file.file.size / 1024 / 1024).toFixed(2)} MB
          </span>

          <section className="flex items-center gap-6">
            <div className="w-full bg-gray-200 rounded h-2">
              <div
                className={`h-2 rounded ${
                  file.error ? "bg-red-500" : "bg-mainDark"
                } transition-all duration-300 ease-linear`}
                style={{ width: `${file.progress}%` }}
              />
            </div>
            {!file.error && (
              <span className="text-xs text-right text-gray-500">
                {file.progress}%
              </span>
            )}
          </section>

          {file.error && (
            <span className="text-xs text-red-600 font-semibold">
              {file.error}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeFile(index)}
        className="text-mainDark text-xl duration-500 cursor-pointer hover:text-red-500 absolute top-3 right-3"
      >
        <IoIosCloseCircle />
      </button>
    </div>
  );
}
