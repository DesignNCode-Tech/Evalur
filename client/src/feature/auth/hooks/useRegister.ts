import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../auth/api/ApiRegister";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,

    // SUCCESS
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      toast.success("Account created successfully", {
        description: "You can now access your dashboard",
      });

      navigate("/auth/login");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Something went wrong";

      if (message.toLowerCase().includes("email")) {
        toast.error("Email already registered", {
          description: "Try logging in or use a different email",
        });
      }
      else if (message.toLowerCase().includes("password")) {
        toast.warning("Invalid password", {
          description: "Please check password requirements",
        });
      }

      else {
        toast.error("Registration failed", {
          description: message,
        });
      }
    },
  });
};