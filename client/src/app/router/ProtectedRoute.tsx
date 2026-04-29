import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();


  if (isLoading) {
    return null; 
  }

  // ❌ Not logged in
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Allowed
  return <Outlet />;
};

export default ProtectedRoute;