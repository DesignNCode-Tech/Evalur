import type { ReactNode } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import  api  from "../../api/axios";

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const queryClient = new QueryClient();
  const token = localStorage.getItem("jwt_token");

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await api.get("/");
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });
  const login = (token: string) => {
    localStorage.setItem("jwt_token", token);
    queryClient.invalidateQueries({ queryKey: ['authuser'] });
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    queryClient.setQueryData(["authUser"], null);
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
        <div className="min-h-screen flex items-center justify-center bg-black">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
