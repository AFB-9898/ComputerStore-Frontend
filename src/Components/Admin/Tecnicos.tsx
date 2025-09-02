import { useEffect, useState, type FormEvent } from "react";

interface Tecnico {
  uId: string;
  nombre: string;
  especialidad: string;
}

export default function Tecnicos() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const fetchTecnicos = async () => {
    const res = await fetch("https://localhost:7221/api/Tecnico");
    const data = await res.json();
    setTecnicos(data);
  };

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("https://localhost:7221/api/Tecnico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, especialidad }),
    });
    setNombre("");
    setEspecialidad("");
    setEditId(null);
    fetchTecnicos();
  };

  const handleEdit = (tecnico: Tecnico) => {
    setEditId(tecnico.uId);
    setNombre(tecnico.nombre);
    setEspecialidad(tecnico.especialidad);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    await fetch(`https://localhost:7221/api/Tecnico/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uId: editId, nombre, especialidad }),
    });
    setNombre("");
    setEspecialidad("");
    setEditId(null);
    fetchTecnicos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar técnico?")) return;
    await fetch(`https://localhost:7221/api/Tecnico/${id}`, { method: "DELETE" });
    fetchTecnicos();
  };

  const handleCancelEdit = () => {
    setNombre("");
    setEspecialidad("");
    setEditId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Técnicos</h2>
      <form onSubmit={editId ? handleUpdate : handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="text"
          placeholder="Especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        {editId ? (
          <>
            <button type="submit" className="bg-blue-600 text-white px-4 rounded">
              Actualizar
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-600 text-white px-4 rounded"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button type="submit" className="bg-green-600 text-white px-4 rounded">
            Agregar
          </button>
        )}
      </form>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Especialidad</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tecnicos.map((t) => (
            <tr key={t.uId}>
              <td className="border p-2">{t.nombre}</td>
              <td className="border p-2">{t.especialidad}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-blue-600 text-white px-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t.uId)}
                  className="bg-red-600 text-white px-2 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}