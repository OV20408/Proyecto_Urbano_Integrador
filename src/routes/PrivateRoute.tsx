import { Navigate } from "react-router-dom";
import { useAuth } from "../pages/AuthContext"; // 👈 asegúrate de importar desde /context

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
