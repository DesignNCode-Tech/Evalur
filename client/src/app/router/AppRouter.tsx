import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { AuthLayout, MainLayout, SecureLayout } from '../layout/Layouts';
import { LoginPage, RegisterPage } from '../../feature/auth/index';
import { HomePage } from '../../feature/home';


export const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES (Only accessible if NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* PROTECTED ROUTES (Only accessible IF logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
        {/* //add dashboard, settings, profile routes here */}
        </Route>

        {/* Locked Down Exam Navigation */}
        <Route element={<SecureLayout />}>
        {/* //add secure routes here, like proctoring or assesment mode */}
        </Route>
      </Route>

      {/* CATCH ALL - Redirects unknown URLs to Dashboard (or Login if logged out) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};