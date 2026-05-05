"use client";

import { useMemo, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthContext";
import api from "../../api/axios";

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const queryClient = useQueryClient();
  
  // 1. Pull the token and user data from storage instantly.
  const token = localStorage.getItem("token");
  
  const storedUser = useMemo(() => {
    const data = localStorage.getItem("user");
    try {
      return data ? (JSON.parse(data) as User) : undefined;
    } catch (e) {
      return undefined;
    }
  }, []);

  // 2. Sync with the Spring Boot backend in the background.
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["authUser"],
    queryFn: async () => {
      // Your existing interceptor handles the Bearer token automatically.
      const response = await api.get("/auth/me");
      return response.data;
    },
    enabled: !!token,
    // CRITICAL: This hydrates the state immediately so you stay logged in on refresh.
    initialData: storedUser, 
    retry: false,
    staleTime: 1000 * 60 * 10, // Consider local data fresh for 10 minutes.
  });

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    queryClient.setQueryData(["authUser"], userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.setQueryData(["authUser"], null);
    queryClient.clear(); // Clear cached organizational data on logout.
  };

  // Only show the global loading spinner if there's a token but NO local user data found.
  const showLoading = isLoading && !!token && !storedUser;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user, 
        isLoading: showLoading,
        login, 
        logout 
      }}
    >
      {showLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
           <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
            <p className="text-[10px] font-black uppercase text-white tracking-widest opacity-50">
              Resuming Evalur Session
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};