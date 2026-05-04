import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        Verifying...
      </div>
    );
  }

  // ❗ Not logged in → go to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // ❗ Role restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;