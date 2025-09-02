import { createContext, useState, useEffect, type FC, type ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";

// Definimos los roles posibles
type UserRole = "cliente" | "admin" | null;

// Tipo del contexto de autenticación
interface AuthContextType {
  user: string | null;
  userId: string | null; // Agregado: ID del usuario para usar en solicitudes
  role: UserRole;
  login: (username: string, role: UserRole, userId: string) => void; // Actualizado para incluir userId
  logout: () => void;
}

// Creamos el contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  role: null,
  login: () => {},
  logout: () => {},
});

// Proveedor del contexto
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Agregado: Estado para userId
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage al montar el componente
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId"); // Agregado
    const storedRole = localStorage.getItem("role") as UserRole;
    if (storedUser && storedUserId && storedRole) {
      setUser(storedUser);
      setUserId(storedUserId);
      setRole(storedRole);
    }
  }, []);

  const login = (username: string, role: UserRole, userId: string) => {
    // Función para iniciar sesión y guardar en localStorage
    setUser(username);
    setUserId(userId); // Agregado
    setRole(role);
    localStorage.setItem("user", username);
    localStorage.setItem("userId", userId); // Agregado
    if (role) localStorage.setItem("role", role);
  };

  const logout = () => {
    // Función para cerrar sesión y limpiar localStorage
    setUser(null);
    setUserId(null); // Agregado
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); // Agregado
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, userId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --------------------
  // Componente PrivateRoute para rutas protegidas
  // --------------------
  type PrivateRouteProps = {
    roles?: UserRole[];
    children: ReactNode;
  };

  export const PrivateRoute: FC<PrivateRouteProps> = ({ roles, children }) => {
    const { user, role } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />; // No logueado
    if (roles && !roles.includes(role)) return <Navigate to="/" />; // Rol no permitido

    return <>{children}</>; // Acceso permitido
  };