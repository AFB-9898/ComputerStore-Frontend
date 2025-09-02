import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

// Importa imágenes locales
import img1 from "../../assets/imagenes/imagenes1.jpg";
import img2 from "../../assets/imagenes/imagenes2.jpg";
import img3 from "../../assets/imagenes/imagenes3.png";
import img4 from "../../assets/imagenes/imagenes2.jpg";

const images = [img1, img2, img3, img4];

interface Categoria {
  uId: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

interface Producto {
  uId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stockActual: number;
  imagenUrl: string;
  estado: boolean;
}

export function Body() {
  const [current, setCurrent] = useState(0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  // Cargar categorías
  useEffect(() => {
    fetch("https://localhost:7221/api/Categoria")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar categorías");
        return res.json();
      })
      .then((data) => {
        setCategorias(data);
        setLoadingCategorias(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingCategorias(false);
      });
  }, []);

  // Cargar productos
  useEffect(() => {
    fetch("https://localhost:7221/api/Producto")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setLoadingProductos(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProductos(false);
      });
  }, []);

  const handleAddToCart = (prod: Producto) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar al carrito.");
      return;
    }
    if (prod.stockActual <= 0) return;

    // Usar uId explícitamente
    console.log(`Agregando producto con uId: ${prod.uId}`); // Log para confirmar uso de uId
    addToCart({
      uId: prod.uId,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: 1,
      imagenUrl: prod.imagenUrl,
      stockActual: prod.stockActual,
    });

    setProductos((prev) =>
      prev.map((p) =>
        p.uId === prod.uId ? { ...p, stockActual: p.stockActual - 1 } : p
      )
    );

    fetch(`https://localhost:7221/api/Producto/${prod.uId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...prod, stockActual: prod.stockActual - 1 }),
    }).catch((err) => console.error(`Error actualizando producto ${prod.uId}:`, err));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Carrusel */}
      <div className="relative max-w-7xl mx-auto h-64 md:h-96 rounded-2xl shadow-2xl overflow-hidden mb-12">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              current === idx ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${idx}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <h2 className="text-white text-2xl md:text-4xl font-extrabold animate-fade-in">
                ¡Explora Nuestros Productos!
              </h2>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === idx ? "bg-blue-600 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categorías */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 animate-fade-in-down">
        Categorías
        </h2>
        {loadingCategorias ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : categorias.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categorias.map((cat, idx) => (
              <div
                key={cat.uId}
                className={`relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer animate-fade-in-up delay-${idx * 100}`}
                onClick={() => console.log(`Categoría seleccionada: ${cat.uId}`)} // Uso explícito de uId
              >
                <h3 className="text-xl font-bold">{cat.nombre}</h3>
                <p className="text-sm mt-2 opacity-90 line-clamp-2">{cat.descripcion}</p>
                <div className="absolute inset-0 bg-white bg-opacity-0 hover:bg-opacity-10 transition duration-300 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay categorías disponibles</p>
        )}
      </div>

      {/* Productos */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 animate-fade-in-down">
        Productos Destacados
        </h2>
        {loadingProductos ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((prod, idx) => (
              <div
                key={prod.uId}
                className={`bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up delay-${idx * 100}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={prod.imagenUrl || "https://via.placeholder.com/300x200"}
                    alt={prod.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {prod.stockActual <= 10 && prod.stockActual > 0 && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">
                      ¡Quedan {prod.stockActual}!
                    </span>
                  )}
                  {prod.stockActual === 0 && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Agotado
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col justify-between h-64">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {prod.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {prod.descripcion}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xl font-extrabold text-green-600">
                      ${prod.precio.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock: {prod.stockActual}
                    </p>
                  </div>
                  <button
                    className={`mt-3 py-2 px-4 rounded-xl text-white font-bold flex items-center justify-center transition ${
                      prod.stockActual > 0
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={prod.stockActual <= 0}
                    onClick={() => handleAddToCart(prod)}
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {user
                      ? prod.stockActual > 0
                        ? "Agregar al Carrito"
                        : "Agotado"
                      : "Inicia Sesión"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No hay productos disponibles</p>
        )}
      </div>
    </div>
  );
}