import { useEffect, useState, type FormEvent } from "react";

interface Categoria {
  uId: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const fetchCategorias = async () => {
    const res = await fetch("https://localhost:7221/api/Categoria");
    const data = await res.json();
    setCategorias(data);
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("https://localhost:7221/api/Categoria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion, estado: true }),
    });
    setNombre("");
    setDescripcion("");
    setEditId(null);
    fetchCategorias();
  };

  const handleEdit = (categoria: Categoria) => {
    setEditId(categoria.uId);
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    await fetch(`https://localhost:7221/api/Categoria/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uId: editId, nombre, descripcion, estado: true }),
    });
    setNombre("");
    setDescripcion("");
    setEditId(null);
    fetchCategorias();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar categoría?")) return;
    await fetch(`https://localhost:7221/api/Categoria/${id}`, { method: "DELETE" });
    fetchCategorias();
  };

  const handleCancelEdit = () => {
    setNombre("");
    setDescripcion("");
    setEditId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categorías</h2>
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
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded flex-1"
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
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.uId}>
              <td className="border p-2">{cat.nombre}</td>
              <td className="border p-2">{cat.descripcion}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-blue-600 text-white px-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cat.uId)}
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