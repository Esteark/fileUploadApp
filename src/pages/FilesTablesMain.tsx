import { useEffect, useState } from "react";
import { getFiles } from "../services/api";

interface FileItem {
  name: string;
  type: string;
  size: string;
  createdAt: string;
  createdBy: string;
  tag: string;
}

export default function FilesTableMain() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFiles();

        // 👇 Aplana el array en caso de que venga [[...]] en lugar de [...]
        const data = Array.isArray(response.data)
          ? response.data.flat()
          : response.data.files || [];

        console.log("📂 Data normalizada:", data);
        setFiles(data);
      } catch (error) {
        console.error("Error consultando archivos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <p className="text-center mt-6">⏳ Cargando archivos...</p>;

  return (
    <main className="max-w-4xl mx-auto mt-12 px-4">
      <h1 className="text-xl font-bold mb-4">📂 Archivos Guardados</h1>

      {files.length === 0 ? (
        <p className="text-gray-500">No hay archivos guardados</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 table-fixed">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Tamaño</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Creado por</th>
                <th className="px-6 py-3">Tag</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index} className="bg-white border-b border-gray-200 ">
                  <td className="px-6 py-4 font-medium text-gray-900 ">
                    {file.name}
                  </td>
                  <td className="px-6 py-4 line-clamp-1">{file.type}</td>
                  <td className="px-6 py-4">{file.size}</td>
                  <td className="px-6 py-4">{file.createdAt}</td>
                  <td className="px-6 py-4">{file.createdBy}</td>
                  <td className="px-6 py-4">{file.tag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
