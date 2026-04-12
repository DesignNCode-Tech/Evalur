import { api } from "@/api/axios";

export const registerUser = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};