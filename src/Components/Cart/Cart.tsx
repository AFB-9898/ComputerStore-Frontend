import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface CartItem {
  uId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
  stockActual: number;
}

interface Usuario {
  uId: string;
  nombre: string;
  email: string;
  rol: "cliente" | "admin";
  passwordHash: string;
}

interface Orden {
  uId: string;
  usuarioId: string;
  total: number;
  fechaCreacion: string;
  estado: string;
}

const API_USUARIO = "https://localhost:7221/api/Usuario";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity, checkout, userId } = useContext(CartContext);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async (usuarioId: string): Promise<Usuario | null> => {
    try {
      const res = await fetch(`${API_USUARIO}/${usuarioId}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al obtener usuario: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("Fetch user error:", err);
      setError(err instanceof Error ? err.message : "No se pudo obtener los datos del usuario.");
      return null;
    }
  };

  const handleGeneratePDF = async () => {
    if (cart.length === 0) {
      setError("El carrito está vacío");
      return;
    }
    if (!userId) {
      setError("Debes iniciar sesión para realizar el pago");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const order: Orden = await checkout();
      if (!order || !order.uId || !order.usuarioId) {
        throw new Error("No se pudo obtener la información del pedido.");
      }

      const user = await fetchUserData(order.usuarioId);
      if (!user) {
        throw new Error("No se pudo obtener los datos del usuario.");
      }

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Factura de Pedido", 14, 22);

      const fecha = new Date(order.fechaCreacion).toLocaleString();
      doc.setFontSize(11);
      doc.text(`Fecha: ${fecha}`, 14, 30);
      doc.text(`Cliente: ${user.nombre}`, 14, 38);
      doc.text(`ID Cliente: ${user.uId}`, 14, 46);
      doc.text(`ID Pedido: ${order.uId}`, 14, 54);

      const tableData = cart.map((item) => [
        item.nombre,
        item.cantidad.toString(),
        `$${item.precio.toFixed(2)}`,
        `$${(item.precio * item.cantidad).toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
        body: tableData,
        startY: 64,
      });

      const finalY: number = (doc as any).lastAutoTable?.finalY || 84;
      const total = cart.reduce((sum: number, i: CartItem) => sum + i.precio * i.cantidad, 0);
      doc.text(`Total: $${total.toFixed(2)}`, 14, finalY + 10);

      doc.save(`Factura_${user.nombre}_${fecha.replace(/[:\/ ]/g, "_")}.pdf`);
      setSuccess("Factura generada correctamente");
    } catch (err) {
      console.error("PDF generation error:", err);
      setError(err instanceof Error ? err.message : "Error al generar la factura.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-200 mb-12 animate-fade-in">
          Tu Carrito
        </h2>
        <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-400/20">
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
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-6 animate-fade-in">
              El carrito está vacío
            </p>
          ) : (
            <>
              <div className="grid gap-6">
                {cart.map((item: CartItem, idx: number) => (
                  <div
                    key={item.uId}
                    className={`flex items-center bg-gray-900/50 rounded-2xl shadow-md p-4 transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up delay-${idx * 100}`}
                  >
                    <img
                      src={item.imagenUrl || "https://via.placeholder.com/150"}
                      alt={item.nombre}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-bold text-gray-200">{item.nombre}</h3>
                      <p className="text-xl font-extrabold text-teal-400">
                        ${item.precio.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Stock disponible: {item.stockActual}
                      </p>
                      <input
                        type="number"
                        min={1}
                        max={item.stockActual}
                        value={item.cantidad}
                        onChange={(e) => updateQuantity(item.uId, parseInt(e.target.value))}
                        className="border border-gray-400/20 rounded-lg p-2 w-20 mt-2 bg-gray-800/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
                        disabled={!item.stockActual || loading}
                      />
                    </div>
                    <button
                      onClick={() => removeFromCart(item.uId)}
                      className="bg-red-600 text-gray-200 py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition duration-200 flex items-center"
                      disabled={loading}
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
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
                <p className="text-2xl font-extrabold text-gray-200">
                  Total: ${cart.reduce((sum: number, i: CartItem) => sum + i.precio * i.cantidad, 0).toFixed(2)}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={clearCart}
                    className="bg-gray-500 text-gray-200 py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition duration-200 flex items-center"
                    disabled={loading}
                  >
                    Vaciar Carrito
                  </button>
                  <button
                    onClick={handleGeneratePDF}
                    className="bg-teal-800 text-gray-200 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 hover:text-gray-900 transition duration-200 flex items-center"
                    disabled={!userId || loading}
                  >
                    {loading ? (
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
                    ) : (
                      "Pagar y Descargar Factura"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}