import { createContext, useContext } from "react";

type role = 'platform_admin' | 'org_admin' | 'dept_manager' | 'cantidate' | 'employee';
export interface User {
  name: string;
  email: string;
  role: role;
  organizationName: string;
}
export interface AuthContextType {
  user: User | undefined;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}