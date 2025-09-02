import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface Usuario {
  uId: string;
  nombre: string;
  email: string;
  rol: "cliente" | "admin";
  passwordHash: string;
}

const API_URL = "https://localhost:7221/api/Usuario";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al consultar usuarios");

      const usuarios: Usuario[] = await res.json();

      const user = usuarios.find(
        (u) => u.email === email && u.passwordHash === password
      );

      if (!user) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      login(user.nombre, user.rol, user.uId);

      if (user.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-gray-900 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-yellow-900/30">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-yellow-900/20 rounded-2xl blur-xl -z-10"></div>
        
        <h2 className="text-3xl font-extrabold text-gray-100 text-center mb-6 animate-fade-in">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-200 rounded-lg text-center transition-all duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800/50 border border-yellow-900/30 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all duration-300 hover:bg-gray-800/70"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800/50 border border-yellow-900/30 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all duration-300 hover:bg-gray-800/70"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-gray-100 py-3 rounded-lg font-semibold hover:bg-yellow-700 hover:text-gray-900 transition-all duration-300 disabled:bg-blue-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-gray-100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}