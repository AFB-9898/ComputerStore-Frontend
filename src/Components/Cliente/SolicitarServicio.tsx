import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API_SERVICIOS = "https://localhost:7221/api/ServicioTecnico";
const API_TECNICOS = "https://localhost:7221/api/Tecnico";

interface Tecnico {
  uId: string;
  nombre: string;
  especialidad: string;
}

export default function SolicitarServicio() {
  const { user, userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    descripcion: "",
    tecnicoId: "",
  });
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTecnicos, setLoadingTecnicos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar técnicos al montar el componente
  useEffect(() => {
    const fetchTecnicos = async () => {
      setLoadingTecnicos(true);
      try {
        const res = await fetch(API_TECNICOS);
        if (!res.ok) throw new Error("Error cargando técnicos");
        const data: Tecnico[] = await res.json();
        console.log("Técnicos recibidos:", data);
        setTecnicos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los técnicos");
      } finally {
        setLoadingTecnicos(false);
      }
    };
    fetchTecnicos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTecnicoSelect = (tecnicoId: string) => {
    setForm({ ...form, tecnicoId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !userId) {
      setError("Debes iniciar sesión para solicitar un servicio");
      return;
    }
    if (!form.tecnicoId) {
      setError("Debes seleccionar un técnico");
      return;
    }

    setLoading(true);
    try {
      const servicio = {
        usuarioId: userId,
        tecnicoId: form.tecnicoId,
        descripcion: form.descripcion,
        estado: "Pendiente",
      };

      const res = await fetch(API_SERVICIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(servicio),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Respuesta de error:", errorData);
        throw new Error(errorData?.message || "Error al enviar la solicitud");
      }

      setForm({ descripcion: "", tecnicoId: "" });
      navigate("/admin/servicios");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 animate-fade-in-down">
          🛠️ Solicitar Servicio Técnico
        </h2>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg animate-pulse">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Problema
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
                placeholder="Describe el problema (Ej: Mi computadora no enciende...)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Técnico
              </label>
              {loadingTecnicos ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tecnicos.map((tecnico) => (
                    <div
                      key={tecnico.uId}
                      onClick={() => handleTecnicoSelect(tecnico.uId)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        form.tecnicoId === tecnico.uId
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:bg-gray-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5z"
                          />
                        </svg>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {tecnico.nombre}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Especialidad: {tecnico.especialidad}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12H8m0 0l-4 4m4-4l-4-4m12 4l4 4m-4-4l4-4"
                    />
                  </svg>
                  Enviar Solicitud
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}