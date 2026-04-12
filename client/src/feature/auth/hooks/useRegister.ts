import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/register";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};