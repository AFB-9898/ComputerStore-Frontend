import { useState, type FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("https://localhost:7221/api/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          rol: "cliente",
          passwordHash: password,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error al crear usuario");
      }

      const newUser = await res.json(); // Get the created user object

      // Log in with nombre, rol, and uId
      login(nombre, "cliente", newUser.uId);

      // Redirect to home
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-gray-900 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-yellow-900/30">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-yellow-900/20 rounded-2xl blur-xl -z-10"></div>
        
        <h2 className="text-3xl font-extrabold text-gray-100 text-center mb-6 animate-fade-in">
          Crear Cuenta
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-200 rounded-lg text-center transition-all duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-gray-800/50 border border-yellow-900/30 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all duration-300 hover:bg-gray-800/70"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-glass-800/50 border border-yellow-900/30 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all duration-300 hover:bg-gray-800/70"
              required
              disabled={submitting}
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
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 text-gray-100 py-3 rounded-lg font-semibold hover:bg-yellow-700 hover:text-gray-900 transition-all duration-300 disabled:bg-green-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {submitting && (
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
            {submitting ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}