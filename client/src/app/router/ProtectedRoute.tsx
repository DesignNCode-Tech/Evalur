import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { isAuthenticated, user: contextUser, isLoading } = useAuth();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const user = contextUser || storedUser;

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Verifying...</div>;
  }

  if (!isAuthenticated && !localStorage.getItem("token")) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;