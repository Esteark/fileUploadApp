import { useContext } from "react";
import {
  FileUploadProvider,
  FileUploadContext,
} from "../../AppContext/FileUploadContext";
import DropZone from "./DropZone";
import FileList from "./FileList";
import FileTable from "./Filetable";

function FileUploadInner() {
  const appContext = useContext(FileUploadContext);
  if (!appContext) return null;

  return (
    <main className="px-6">
      <section className="max-w-full md:max-w-3xl mx-auto my-16 flex flex-col gap-3">
        <DropZone />
        <FileList />
        {appContext.allUploadsComplete && (
          <FileTable
            uploadedFiles={appContext.uploadedFiles}
            formikRef={appContext.formikRef}
          />
        )}
      </section>
    </main>
  );
}

export default function FileUpload() {
  return (
    <FileUploadProvider>
      <FileUploadInner />
    </FileUploadProvider>
  );
}
