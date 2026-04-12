import type { ReactNode } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { api } from "../../api/axios";

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const queryClient = new QueryClient();

  const token = localStorage.getItem("jwt_token");

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await api.get("/");
        return response.data;
      } catch (error) {
        console.log("Auth fetch failed:", error);
        return null;
      }
    },
    enabled: !!token,
    retry: false,
  });

  const login = (token: string) => {
    localStorage.setItem("jwt_token", token);
    queryClient.invalidateQueries({ queryKey: ["authUser"] }); 
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
        isAuthenticated: !!user, // 
        isLoading,
        login,
        logout,
      }}
    >
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};