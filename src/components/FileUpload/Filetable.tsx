import { useContext, type RefObject } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import type { UploadFile } from "../types";
import { FileUploadContext } from "../../AppContext/FileUploadContext";
import { postFile } from "../../services/api";

interface Props {
  uploadedFiles: UploadFile[];
  formikRef: RefObject<any>;
}

export default function FileTable({ uploadedFiles, formikRef }: Props) {
  const appContext = useContext(FileUploadContext);
  return (
    <Formik
      initialValues={{
        files: uploadedFiles.map((file) => ({
          name: file.file.name,
          type: file.file.type || "Desconocido",
          size: (file.file.size / 1024 / 1024).toFixed(2) + " MB",
          createdAt: file.createdAt || "",
          createdBy: file.createdBy || "UserFile",
          tag: "",
          error: file.error,
          progress: file.progress,
        })),
      }}
      validationSchema={Yup.object({
        files: Yup.array().of(
          Yup.object().shape({
            name: Yup.string().required("Nombre requerido"),
            tag: Yup.string().required("Selecciona un tag"),
          })
        ),
      })}
      innerRef={formikRef}
      onSubmit={async (values, { resetForm }) => {
        const invalidFiles = values.files.filter(
          (f) => f.error || f.progress < 100
        );
        if (invalidFiles.length > 0) {
          toast.error(
            "⚠️ No puedes enviar: hay archivos inválidos o incompletos."
          );
          return;
        }

        const cleanFiles = values.files.map(
          ({ name, type, size, createdAt, createdBy, tag }) => ({
            name,
            type,
            size,
            createdAt,
            createdBy,
            tag,
          })
        );

        console.log("📦 Datos listos para enviar:", cleanFiles);

        try {
          for (const file of cleanFiles) {
            await postFile({
              ...file,
              id: crypto.randomUUID(), // 👈 se genera un id único por archivo
            });
          }

          toast.success("✅ Archivos enviados correctamente");
          resetForm();
          appContext?.clearFiles();
        } catch (error) {
          toast.error("❌ Hubo un error al enviar los archivos");
        }
      }}
    >
      {({ values, isValid }) => {
        const hasErrors = values.files.some((f) => f.error);
        const notCompleted = values.files.some((f) => f.progress < 100);
        const disableSubmit = !isValid || hasErrors || notCompleted;

        return (
          <Form className="mt-6 space-y-4 flex flex-col">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-fixed min-w-[800px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 w-[20%]">Nombre</th>
                    <th className="px-6 py-3">Tipo</th>
                    <th className="px-6 py-3">Tamaño</th>
                    <th className="px-6 py-3">Fecha</th>
                    <th className="px-6 py-3">Creado por</th>
                    <th className="px-6 py-3 w-[20%]">Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {values.files.map((file, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b border-gray-200"
                    >
                      {/* Nombre */}
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <Field
                          name={`files[${index}].name`}
                          className="w-full border px-2 py-1 rounded text-sm"
                        />
                        <ErrorMessage
                          name={`files[${index}].name`}
                          component="div"
                          className="text-xs text-red-500"
                        />
                      </td>

                      {/* Tipo */}
                      <td className="px-6 py-4 line-clamp-1">{file.type}</td>

                      {/* Tamaño */}
                      <td className="px-6 py-4">{file.size}</td>

                      {/* Fecha */}
                      <td className="px-6 py-4">{file.createdAt}</td>

                      {/* Creado por */}
                      <td className="px-6 py-4">{file.createdBy}</td>

                      {/* Tag */}
                      <td className="px-6 py-4">
                        <Field
                          as="select"
                          name={`files[${index}].tag`}
                          className="w-full border px-2 py-1 rounded text-sm"
                        >
                          <option value="">Seleccione</option>
                          <option value="Trabajo">Trabajo</option>
                          <option value="Personal">Personal</option>
                          <option value="Urgente">Urgente</option>
                        </Field>
                        <ErrorMessage
                          name={`files[${index}].tag`}
                          component="div"
                          className="text-xs text-red-500 mt-2"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={disableSubmit}
              className={`px-5 py-2.5 rounded w-full md:w-fit text-sm font-medium text-white self-end duration-500 cursor-pointer
                ${
                  disableSubmit
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-mainDark hover:bg-black"
                }`}
            >
              Enviar
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
