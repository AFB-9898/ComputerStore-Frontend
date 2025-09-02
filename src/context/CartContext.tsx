import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface CartItem {
  uId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
  stockActual: number;
}

interface Orden {
  uId: string;
  usuarioId: string;
  total: number;
  fechaCreacion: string;
  estado: string;
}

interface CartContextType {
  cart: CartItem[];
  userId: string | null;
  setUserId: (userId: string | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (uId: string) => void;
  clearCart: () => void;
  updateQuantity: (uId: string, cantidad: number) => void;
  checkout: () => Promise<Orden>;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  userId: null,
  setUserId: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateQuantity: () => {},
  checkout: async () => ({ uId: "", usuarioId: "", total: 0, fechaCreacion: "", estado: "" }),
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userId: authUserId } = useContext(AuthContext);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(authUserId); // Sync with AuthContext
  }, [authUserId]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.uId === item.uId);
      if (existing) {
        return prev.map((i) =>
          i.uId === item.uId ? { ...i, cantidad: i.cantidad + item.cantidad } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (uId: string) => {
    setCart((prev) => prev.filter((item) => item.uId !== uId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (uId: string, cantidad: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.uId === uId && cantidad <= item.stockActual && cantidad > 0
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const checkout = async (): Promise<Orden> => {
    if (!userId) throw new Error("Usuario no autenticado");
    const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const payload = {
      usuarioId: userId,
      total,
      estado: "Pendiente",
      items: cart.map((item) => ({
        productoId: item.uId,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
    };
    console.log("Checkout payload:", payload);
    try {
      const res = await fetch("https://localhost:7221/api/Orden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Checkout API error:", errorData);
        throw new Error(errorData.message || `Error al crear orden: ${res.status}`);
      }
      const order = await res.json();
      console.log("Checkout response:", order);
      clearCart();
      return order;
    } catch (err) {
      console.error("Checkout error:", err);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, userId, setUserId, addToCart, removeFromCart, clearCart, updateQuantity, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};