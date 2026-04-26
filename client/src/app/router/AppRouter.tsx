import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { AuthLayout, MainLayout, SecureLayout } from '../layout/Layouts';
import { LoginPage, RegisterPage } from '../../feature/auth';
import { HomePage } from '../../feature/home';
import { CorporateAdmin } from '@/feature/dashboard/pages/CorporateAdmin';
import InvitePage from '@/feature/dashboard/pages/InvitePage';

export const AppRouter = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES (Only accessible if NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/join" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* PROTECTED ROUTES (Only accessible IF logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* //add dashboard, settings, profile routes here */}
        </Route>

        {/* Locked Down Exam Navigation */}
        <Route element={<SecureLayout />}>
          {/* //add secure routes here */}
        </Route>
      </Route>

      {/* 👇 ROLE PROTECTED ROUTE */}
      {/* Admin only route */}
      <Route element={<ProtectedRoute allowedRoles={["CORPORATE_ADMIN"]} />}>
        <Route path="/corporate" element={<CorporateAdmin />} />
      </Route>

      {/* INVITE ROUTE (FIXED AS PER REVIEW) */}
      <Route element={<ProtectedRoute allowedRoles={["CORPORATE_ADMIN", "MANAGER"]} />}>
        <Route path="/invite" element={<InvitePage />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
};