import axios from "axios";
import type { FilePayload } from "../components/types";

/*importo la variable de entorno correspondiente si esto en local inportará .env  si esto en devploy importará .env.production*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔹 Interceptor de request (antes de mandar la petición)
api.interceptors.request.use(
  (config) => {
    console.log(
      "📤 Enviando petición:",
      config.method?.toUpperCase(),
      config.url
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 Interceptor de response (cuando llega respuesta)
api.interceptors.response.use(
  (response) => {
    console.log("📥 Respuesta recibida:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Error en petición:", error);
    return Promise.reject(error);
  }
);

// 🔹 Funciones auxiliares
export const postFile = (file: FilePayload) => {
  return api.post("/files", file);
};
export const getFiles = () => api.get("/files");

export default api;
