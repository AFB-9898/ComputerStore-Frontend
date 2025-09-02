import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductosByCategoria } from "../Service/apiService";
import { ProductCard } from "./ProductCard";

export const ProductList = () => {
  const { id } = useParams<{ id: string }>();
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        if (id) {
          const data = await fetchProductosByCategoria(id);
          setProductos(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProductos();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Cargando productos...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.length > 0 ? (
          productos.map((prod) => (
            <ProductCard key={prod.uId} producto={prod} />
          ))
        ) : (
          <p className="text-center col-span-3">No hay productos en esta categoría</p>
        )}
      </div>
    </div>
  );
};
