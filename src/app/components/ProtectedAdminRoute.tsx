import { Navigate, useLocation } from "react-router";
import { useAuth } from "../AuthContext";

export function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}