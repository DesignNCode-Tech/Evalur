// src/feature/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/AuthApi'; // Imports the object we just made

export const useLogin = () => {
  return useMutation({
    // You literally just pass the function here! 
    mutationFn: authApi.login, 
    
    onSuccess: (data) => {
      localStorage.setItem('jwt_token', data.token);
      // add navigation or toast logic here
    },
  });
};