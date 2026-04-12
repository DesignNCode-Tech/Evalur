import { api } from "@/api/axios";
import type{ RegisterFormData } from "../schema/registerSchema";

export interface AuthResponse {
  token: string;
}

export const registerUser = async (
  data: RegisterFormData
): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};