import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, send them to the login page
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};