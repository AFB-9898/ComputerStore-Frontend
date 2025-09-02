import { useState, useEffect, type FormEvent } from "react";
import {
  fetchCategorias,
  fetchProductos,
  addProducto,
  deleteProducto,
  updateProducto,
} from "../Service/apiService";

interface Producto {
  uId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stockActual: number;
  imagenUrl: string | null;
  categoriaId: string;
}

interface Categoria {
  uId: string;
  nombre: string;
}

export function AgregarProducto() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState({
    uId: "", // Para manejar edición
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagenUrl: "",
    categoriaId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        fetchProductos(),
        fetchCategorias(),
      ]);
      setProductos(prods);
      setCategorias(cats);
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
    setSuccess(null);

    if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoriaId) {
      setError("Todos los campos obligatorios deben estar completos");
      return;
    }

    setSubmitting(true);
    try {
      const producto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stockActual: parseInt(formData.stock),
        categoriaId: formData.categoriaId,
        imagenUrl: formData.imagenUrl || null,
      };

      if (isEditing) {
        // Actualizar producto existente
        await updateProducto(formData.uId, producto);
        setSuccess("Producto actualizado correctamente");
        setProductos((prev) =>
          prev.map((p) =>
            p.uId === formData.uId ? { ...p, ...producto } : p
          )
        );
      } else {
        // Agregar nuevo producto
        await addProducto(producto);
        setSuccess("Producto agregado correctamente");
      }

      setFormData({
        uId: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
        categoriaId: "",
      });
      setIsEditing(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (producto: Producto) => {
    setFormData({
      uId: producto.uId,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      stock: producto.stockActual.toString(),
      imagenUrl: producto.imagenUrl || "",
      categoriaId: producto.categoriaId,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro de eliminar este producto?")) return;
    try {
      await deleteProducto(id);
      setProductos((prev) => prev.filter((p) => p.uId !== id));
      setSuccess("Producto eliminado correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      uId: "",
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      imagenUrl: "",
      categoriaId: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12 animate-fade-in-down">
          🛍️ Gestionar Productos
        </h2>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg animate-pulse">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto
              </label>
              <input
                type="text"
                placeholder="Ej: Laptop Dell XPS"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ej: 999.99"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                placeholder="Ej: 10"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen
              </label>
              <input
                type="text"
                placeholder="Ej: https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                required
                disabled={submitting}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.uId} value={cat.uId}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                placeholder="Ej: Laptop de alto rendimiento..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                disabled={submitting}
              />
            </div>
            <div className="sm:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {submitting ? "Procesando..." : isEditing ? "Actualizar Producto" : "Agregar Producto"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-200 flex items-center justify-center"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in-down">
            Productos Agregados
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((producto, idx) => (
                <div
                  key={producto.uId}
                  className={`bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up delay-${idx * 100}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={producto.imagenUrl || "https://via.placeholder.com/150"}
                      alt={producto.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between h-64">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {producto.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {producto.descripcion}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-xl font-extrabold text-green-600">
                        ${producto.precio.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {producto.stockActual}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(producto)}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-200 flex items-center justify-center"
                      >
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(producto.uId)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-200 flex items-center justify-center"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">No hay productos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}