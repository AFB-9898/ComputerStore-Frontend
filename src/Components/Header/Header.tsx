import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

export function Header() {
  const navigate = useNavigate();
  const { user, role, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const handleServicioClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/solicitar-servicio");
    }
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer hover:text-blue-400 transition"
          onClick={() => navigate("/")}
        >
          ComputoStore
        </h1>

        <nav className="flex gap-4 items-center text-sm md:text-base">
          <Link to="/" className="hover:text-blue-400 transition">
            Inicio
          </Link>

          <button
            onClick={handleServicioClick}
            className="hover:text-blue-400 transition font-semibold"
          >
            🛠️ Solicitar Servicio
          </button>

          {role === "admin" && (
            <Link
              to="/admin"
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md transition"
            >
              Panel Admin
            </Link>
          )}

          <Link
            to="/cart"
            className="relative flex items-center gap-1 hover:text-orange-400 transition font-semibold"
          >
            🛒 Carrito
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-md transition"
              >
                Registro
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition font-semibold"
            >
              Cerrar Sesión
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
