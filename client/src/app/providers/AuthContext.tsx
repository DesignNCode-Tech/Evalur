import { createContext, useContext } from "react";

// Updated roles to match your AppRouter and Research Design[cite: 1]
// Add ADMIN to the list
export type Role = 'ADMIN' | 'CORPORATE_ADMIN' | 'MANAGER' | 'CANDIDATE' | 'EMPLOYEE';

export interface User {
  name: string;
  email: string;
  role: Role;
  organizationName?: string;
}

export interface AuthContextType {
  user: User | undefined;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void; 
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};