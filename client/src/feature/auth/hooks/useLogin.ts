import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../auth/api/ApiLogin";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: updateAuthContext } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // 1. Create the user object from the flat response
      const userObj = {
        name: data.email.split('@')[0], // Temporary: extraction from email
        email: data.email,
        role: data.role,
        organizationName: "" // Placeholder for your research context
      };

      // 2. Update Context and Storage
      updateAuthContext(data.token, userObj);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userObj));

      toast.success("Login Successful");
      
      // 3. Move to dashboard
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error("Login Failed", {
        description: error?.response?.data?.message || "Invalid credentials",
      });
    },
  });
};