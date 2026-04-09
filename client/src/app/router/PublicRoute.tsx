import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // If they are already logged in, send them straight to the app
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};