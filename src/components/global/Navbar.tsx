import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  return (
    <nav className="p-4 bg-gray-100 flex gap-4">
      {/* Mostrar el botón solo si NO estoy en "/" */}
      {pathname !== "/" && (
        <Link to="/" className="text-mainDark hover:underline">
          Subir Archivos
        </Link>
      )}

      {/* Mostrar el botón solo si NO estoy en "/files" */}
      {pathname !== "/files" && (
        <Link to="/files" className="text-mainDark hover:underline">
          Ver Archivos
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
