import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/register";
import type { RegisterFormData } from "../schema/registerSchema";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
  });
};