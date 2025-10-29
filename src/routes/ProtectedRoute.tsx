import React from "react";
import { Navigate } from "react-router-dom";

const isAuthMock = true; // luego reemplaza por tu estado real

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAuthMock) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;

