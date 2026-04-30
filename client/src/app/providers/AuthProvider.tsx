import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthContext";
import api from "../../api/axios";

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const queryClient = useQueryClient();
  
  // Use "token" consistently to match your useLogin and ProtectedRoute logic
  const token = localStorage.getItem("token");

  // This query handles fetching the user on page refresh
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["authUser"],
    queryFn: async () => {
      // Fetches the current user context from the backend
      const response = await api.get("/auth/me"); 
      return response.data;
    },
    enabled: !!token, // Only run if a token exists
    retry: false,
    staleTime: Infinity, // Keep the user data until logout
  });

  /**
   * Updated login to accept both token and user object.
   * This provides an "Instant Login" experience for Evalur.
   */
  const login = (newToken: string, userData: User) => {
    // 1. Persist to storage
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // 2. Manually set the query data so isAuthenticated becomes true immediately
    queryClient.setQueryData(["authUser"], userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.setQueryData(["authUser"], null);
    queryClient.clear(); // Clear all cached organizational data
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout 
      }}
    >
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="text-sm font-medium">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};