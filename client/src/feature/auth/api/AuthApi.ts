import { api } from '../../../api/axios';

// 1. Define the exact shapes of our data (Mirroring Spring Boot DTOs)
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string; 
  organizationId?: number; 
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
}

const BASE_URL = '/auth';

export const authApi = {
  // 2. Apply the types to the functions
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post(`${BASE_URL}/login`, credentials);
   // ApiResponse: { success, message, data }
    return response.data.data; 
  },
  
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post(`${BASE_URL}/register`, userData);
    return response.data.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const response = await api.get(`${BASE_URL}/me`);
    return response.data.data;
  }
};