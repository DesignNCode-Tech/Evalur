import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/ApiLogin";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      // store token
      localStorage.setItem("token", data.token);

      //  store user (IMPORTANT for role-based routes)
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          role: data.role,
        })
      );

      toast.success("Login successful", {
        description: `Logged in as ${data.role}`,
      });

      // redirect handled in component
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Invalid credentials";

      toast.error("Login failed", {
        description: message,
      });
    },
  });
};