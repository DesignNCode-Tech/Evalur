import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/loginSchema";
import type { LoginFormData } from "../schema/loginSchema";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: (res) => {
        if (res?.token) {
          localStorage.setItem("token", res.token);
        }
        navigate("/dashboard");
      },
      onError: () => {
        alert("Invalid credentials");
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-6 hidden md:block">
          <h1 className="text-4xl font-bold">
            Welcome to Evalur 
          </h1>

          <p className="text-muted-foreground text-lg">
            Access your account securely and continue your journey with a smooth,
            structured experience designed for modern workflows.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <Card className="w-full">
          <CardContent className="p-8 space-y-6">

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Login</h2>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </Button>

            </form>

            {/* FOOTER */}
            <p className="text-sm text-center text-muted-foreground">
              Don’t have an account?{" "}
              <span
                className="cursor-pointer underline"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}