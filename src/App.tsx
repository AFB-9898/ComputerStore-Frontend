import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./Components/Header/Header";
import { Footer } from "./Components/Footer/Footer";
import { Body } from "./Components/Body/Body";

// Auth
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import { AuthProvider, PrivateRoute } from "./context/AuthContext";

// Carrito
import { CartProvider } from "./context/CartContext";
import Cart from "./Components/Cart/Cart";

// Cliente
import SolicitarServicio from "./Components/Cliente/SolicitarServicio";

// Admin
import { AdminPanel } from "./Components/Admin/AdminPanel";
import { AgregarProducto } from "./Components/Admin/AgregarProducto";
import GestionCategorias from "./Components/Admin/Categorias";
import GestionTecnicos from "./Components/Admin/Tecnicos";
import ServiciosTecnicos from "./Components/Admin/Servicios";
import Inventario from "./Components/Admin/Usuarios";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                {/* Públicas */}
                <Route path="/" element={<Body />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Privadas */}
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute roles={["cliente", "admin"]}>
                      <Cart />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/solicitar-servicio"
                  element={
                    <PrivateRoute roles={["cliente", "admin"]}>
                      <SolicitarServicio />
                    </PrivateRoute>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute roles={["admin"]}>
                      <AdminPanel />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/productos"
                  element={
                    <PrivateRoute roles={["admin"]}>
                      <AgregarProducto />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/categorias"
                  element={
                    <PrivateRoute roles={["admin"]}>
                      <GestionCategorias />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/tecnicos"
                  element={
                    <PrivateRoute roles={["admin"]}>
                      <GestionTecnicos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/servicios"
                  element={
                    <PrivateRoute roles={["admin"]}>
                      <ServiciosTecnicos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/inventario"
                  element={
                    <PrivateRoute roles={["admin"]}>
                      <Inventario />
                    </PrivateRoute>

                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;