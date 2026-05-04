import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthContext";

export default function RoleRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/login" replace />;

  const role = user.role?.toUpperCase();

  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "MANAGER") return <Navigate to="/manager" replace />;
  if (role === "STAFF") return <Navigate to="/staff" replace />;
  if (role === "CANDIDATE") return <Navigate to="/candidate" replace />;

  return <Navigate to="/unauthorized" replace />;
}