import { type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/axios';
import { AuthContext } from './AuthContext'; 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('jwt_token');

  const { data: user, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
    //add the correct endpoint to fetch the authenticated user's details
      const response = await api.get('/auth/me'); 
     return response.data.data;
    },
    enabled: !!token, 
    retry: false, 
  });

  const login = (newToken: string) => {
    localStorage.setItem('jwt_token', newToken);
    queryClient.invalidateQueries({ queryKey: ['authUser'] }); 
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    queryClient.setQueryData(['authUser'], null); 
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