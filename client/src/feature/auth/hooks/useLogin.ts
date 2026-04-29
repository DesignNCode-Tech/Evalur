import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../api/axios";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/auth/login", data); // matches backend
      return res.data; // AuthResponse
    },

    onSuccess: (data) => {
      // store full response
      localStorage.setItem("auth", JSON.stringify(data));

      toast.success("Login successful", {
        description: "Welcome back!",
      });

      // 🔥 role-based redirect
      if (data.role === "dept_manager") {
        navigate("/manager");
      } else if (data.role === "CORPORATE_ADMIN") {
        navigate("/corporate");
      } else {
        navigate("/dashboard");
      }
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