import api from "@/api/axios";
import type { LoginFormData } from "../schema/loginSchema";

export const loginUser = async (data: LoginFormData) => {
  // Hits the public auth endpoint
  const res = await api.post("/auth/login", data);
  return res.data; 
};