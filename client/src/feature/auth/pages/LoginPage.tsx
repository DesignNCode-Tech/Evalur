import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginFormData,
} from "../schema/loginSchema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: (res) => {
        const roleRedirectMap: Record<string, string> = {
          CORPORATE_ADMIN: "/corporate",
          MANAGER: "/dashboard",
          STAFF: "/dashboard",
          CANDIDATE: "/dashboard",
        };

        navigate(roleRedirectMap[res.role] || "/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100 text-black">
      <div className="hidden md:flex flex-col justify-center px-16 bg-gray-200">
        <h1 className="text-4xl font-bold mb-4">
          Welcome Back
        </h1>
        <p className="text-gray-700 text-lg">
          Login to continue....
        </p>
      </div>

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <h2 className="text-2xl font-semibold text-black mb-2">
              Login
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-2">Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-4">Password</Label>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register/join")}
                className="font-medium text-black cursor-pointer hover:underline"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}