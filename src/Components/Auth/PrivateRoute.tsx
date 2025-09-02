import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  children: ReactNode;
  role?: "cliente" | "admin";
}

export default function PrivateRoute({ children, role }: Props) {
  const { user, role: userRole } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  return <>{children}</>;
}
