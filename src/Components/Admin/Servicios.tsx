import { useState, useEffect, type FormEvent } from "react";

// Endpoints de tu API
const API_SERVICIOS = "https://localhost:7221/api/ServicioTecnico";
const API_USUARIOS = "https://localhost:7221/api/Usuario";
const API_TECNICOS = "https://localhost:7221/api/Tecnico";

export default function ServiciosTecnicos() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    usuarioId: "",
    tecnicoId: "",
    descripcion: "",
    estado: "Pendiente",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resServicios, resUsuarios, resTecnicos] = await Promise.all([
        fetch(API_SERVICIOS),
        fetch(API_USUARIOS),
        fetch(API_TECNICOS),
      ]);

      if (!resServicios.ok || !resUsuarios.ok || !resTecnicos.ok)
        throw new Error("Error cargando datos");

      const dataServicios = await resServicios.json();
      const dataUsuarios = await resUsuarios.json();
      const dataTecnicos = await resTecnicos.json();

      setServicios(Array.isArray(dataServicios) ? dataServicios : [dataServicios]);
      setUsuarios(dataUsuarios);
      setTecnicos(dataTecnicos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(API_SERVICIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error creando servicio");

      setFormData({ usuarioId: "", tecnicoId: "", descripcion: "", estado: "Pendiente" });
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    try {
      const res = await fetch(`${API_SERVICIOS}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando servicio");
      setServicios((prev) => prev.filter((s) => s.uId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-center">
        ⚡ Gestión de Servicios Técnicos
      </h2>

      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col gap-4 md:flex-row md:items-end md:gap-6 transition hover:shadow-2xl"
      >
        <select
          value={formData.usuarioId}
          onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
          className="border rounded-lg p-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 transition"
          required
        >
          <option value="">Seleccione un Usuario</option>
          {usuarios.map((u) => (
            <option key={u.uId} value={u.uId}>
              {u.nombre} ({u.email})
            </option>
          ))}
        </select>

        <select
          value={formData.tecnicoId}
          onChange={(e) => setFormData({ ...formData, tecnicoId: e.target.value })}
          className="border rounded-lg p-2 w-full md:w-1/3 focus:ring-2 focus:ring-purple-400 transition"
          required
        >
          <option value="">Seleccione un Técnico</option>
          {tecnicos.map((t) => (
            <option key={t.uId} value={t.uId}>
              {t.nombre} ({t.especialidad})
            </option>
          ))}
        </select>

        <textarea
          placeholder="Descripción del servicio..."
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="border rounded-lg p-2 w-full md:w-1/3 focus:ring-2 focus:ring-green-400 transition resize-none"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className={`py-2 px-6 rounded-lg text-white font-semibold ${
            submitting ? "bg-gray-400" : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500"
          } transition transform hover:-translate-y-1 hover:shadow-lg`}
        >
          {submitting ? "Agregando..." : "➕ Agregar Servicio"}
        </button>
      </form>

      {/* Lista de servicios */}
      <h3 className="text-2xl font-bold mb-4 text-gray-700">Servicios Registrados</h3>

      {loading ? (
        <p className="text-gray-500 text-center">Cargando servicios...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((s) => (
            <div
              key={s.uId}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="mb-3">
                <p className="font-semibold text-sm text-gray-500">ID: {s.uId}</p>
                <p className="text-lg font-bold text-gray-800">{s.usuario?.nombre || s.usuarioId}</p>
                <p className="text-purple-600 font-medium">{s.tecnico?.nombre || s.tecnicoId}</p>
                <p className="mt-2 text-gray-700">{s.descripcion}</p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    s.estado === "Pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : s.estado === "En Proceso"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {s.estado}
                </span>
              </div>
              <button
                onClick={() => handleDelete(s.uId)}
                className="mt-3 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition"
              >
              Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
