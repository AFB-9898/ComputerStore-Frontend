export const ProductCard = ({ producto }: { producto: any }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="overflow-hidden h-48">
        <img
          src={producto.imagenUrl || "https://via.placeholder.com/300x200"}
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
        />
      </div>

      <div className="p-4 flex flex-col justify-between h-60">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
            {producto.nombre}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {producto.descripcion}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-indigo-600 font-bold text-lg">💲{producto.precio}</p>
          <button
            className={`w-full py-2 rounded-xl text-white font-semibold transition-all duration-300 ${
              producto.stockActual > 0
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={producto.stockActual <= 0}
          >
            {producto.stockActual > 0 ? "🛒 Agregar al carrito" : "Agotado"}
          </button>
        </div>
      </div>
    </div>
  );
};
