import { useState, useEffect, type FormEvent } from "react";

interface Usuario {
  uId: string;
  nombre: string;
  email: string;
  rol: "cliente" | "admin";
  passwordHash: string;
}

const API_USUARIO = "https://localhost:7221/api/Usuario";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({ uId: "", nombre: "", email: "", rol: "cliente" as "cliente" | "admin", passwordHash: "" });
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterRol, setFilterRol] = useState<"cliente" | "admin" | "">("");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(API_USUARIO, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al obtener usuarios: ${res.status}`);
      }
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Fetch error (GET):", err);
      setError(err instanceof Error ? err.message : "No se pudo conectar con el servidor. Verifique la conexión o la URL de la API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.rol || (!isEditing && !formData.passwordHash)) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Correo electrónico inválido");
      return;
    }
    if (!isEditing && formData.passwordHash.length < 2) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = isEditing
      ? {
          uId: formData.uId,
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol === "cliente" ? "Cliente" : "Admin", // Adjust for backend case sensitivity
          ...(formData.passwordHash && { passwordHash: formData.passwordHash }), // Only include if changed
        }
      : {
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol === "cliente" ? "Cliente" : "Admin",
          passwordHash: formData.passwordHash,
        };

    console.log("Request payload:", payload);
    console.log("Request URL:", isEditing ? `${API_USUARIO}/${formData.uId}` : API_USUARIO);
    console.log("Request method:", isEditing ? "PUT" : "POST");

    try {
      const res = await fetch(isEditing ? `${API_USUARIO}/${formData.uId}` : API_USUARIO, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let errorData: any = {};
      try {
        if (res.headers.get("content-type")?.includes("application/json")) {
          errorData = await res.json();
        } else {
          errorData = { message: await res.text() || "No response body provided" };
        }
      } catch (jsonErr) {
        console.error("JSON parse error:", jsonErr);
        errorData = { message: await res.text() || "Empty or invalid response body" };
      }

      if (!res.ok) {
        console.error("API error response:", errorData);
        throw new Error(
          errorData.message ||
            errorData.errors?.join(", ") ||
            `Error al ${isEditing ? "actualizar" : "agregar"} usuario: ${res.status}`
        );
      }

      const responseData = errorData || (await res.json());
      console.log("API response:", responseData);
      setSuccess(`Usuario ${isEditing ? "actualizado" : "agregado"} correctamente`);
      setFormData({ uId: "", nombre: "", email: "", rol: "cliente", passwordHash: "" });
      setIsEditing(false);
      loadData();
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: Usuario) => {
    setFormData({
      uId: user.uId,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol.toLowerCase() as "cliente" | "admin", // Normalize for frontend
      passwordHash: "", // Clear password to avoid sending unchanged
    });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_USUARIO}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al eliminar usuario: ${res.status}`);
      }
      setSuccess("Usuario eliminado correctamente");
      setUsuarios((prev) => prev.filter((user) => user.uId !== id));
    } catch (err) {
      console.error("Fetch error (DELETE):", err);
      setError(err instanceof Error ? err.message : "No se pudo conectar con el servidor.");
    }
  };

  const handleCancelEdit = () => {
    setFormData({ uId: "", nombre: "", email: "", rol: "cliente", passwordHash: "" });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const filteredUsuarios = filterRol
    ? usuarios.filter((user) => user.rol.toLowerCase() === filterRol)
    : usuarios;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-200 text-center mb-8 animate-fade-in">
          Gestión de Usuarios
        </h2>

        <div className="bg-gray-900/30 backdrop-blur-lg rounded-xl shadow-2xl p-6 mb-8 border border-gray-400/20">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 text-red-200 rounded-lg text-center transition-all duration-300">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 text-green-200 rounded-lg text-center transition-all duration-300">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-400/20 rounded-lg p-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:bg-gray-900/70"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-400/20 rounded-lg p-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:bg-gray-900/70"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Rol
              </label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value as "cliente" | "admin" })}
                className="w-full bg-gray-900/50 border border-gray-400/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:bg-gray-900/70"
                required
                disabled={submitting}
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder={isEditing ? "Dejar en blanco para no cambiar" : "••••••••"}
                value={formData.passwordHash}
                onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-400/20 rounded-lg p-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:bg-gray-900/70"
                required={!isEditing}
                disabled={submitting}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-800 text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-400 hover:text-gray-900 transition-all duration-300 disabled:bg-teal-600 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-gray-200"
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
                    Procesando...
                  </>
                ) : isEditing ? (
                  "Actualizar"
                ) : (
                  "Agregar"
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-500 text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                  disabled={submitting}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Filtrar por Rol
            </label>
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value as "cliente" | "admin" | "")}
              className="w-full md:w-48 bg-gray-900/50 border border-gray-400/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:bg-gray-900/70"
            >
              <option value="">Todos</option>
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-900/30 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-gray-400/20">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">
            Lista de Usuarios
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></div>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <p className="text-center text-gray-500">No hay usuarios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="border border-gray-400/20 p-3 text-left text-sm font-semibold text-gray-300">Nombre</th>
                    <th className="border border-gray-400/20 p-3 text-left text-sm font-semibold text-gray-300">Correo</th>
                    <th className="border border-gray-400/20 p-3 text-left text-sm font-semibold text-gray-300">Rol</th>
                    <th className="border border-gray-400/20 p-3 text-left text-sm font-semibold text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((user) => (
                    <tr key={user.uId} className="hover:bg-gray-800/50 transition-all duration-200">
                      <td className="border border-gray-400/20 p-3 text-gray-200">{user.nombre}</td>
                      <td className="border border-gray-400/20 p-3 text-gray-200">{user.email}</td>
                      <td className="border border-gray-400/20 p-3 text-gray-200">{user.rol}</td>
                      <td className="border border-gray-400/20 p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-600 text-gray-200 px-3 py-1 rounded-lg hover:bg-yellow-700 transition-all duration-200"
                          disabled={submitting}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(user.uId)}
                          className="bg-red-600 text-gray-200 px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-200"
                          disabled={submitting}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}