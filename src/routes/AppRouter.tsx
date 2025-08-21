import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "../components/FileUpload/FileUpload";
import FilesTable from "../pages/FilesTablesMain";
import Navbar from "../components/global/Navbar";

export default function AppRouter() {
  return (
    <Router>
      {/* Menú de navegación */}
      <Navbar />
      {/* Rutas */}
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/files" element={<FilesTable />} />
      </Routes>
    </Router>
  );
}
