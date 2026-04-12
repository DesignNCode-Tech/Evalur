<<<<<<< Updated upstream
export const LoginPage = () => {
  return (
    <div>    
      <h1>Login Page</h1>
    </div>
  )
=======
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: (res) => {
        if (res?.token) {
          localStorage.setItem("token", res.token);
        }
        navigate("/dashboard");
      },
      onError: (err) => {
        console.error("Login Failed", err);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-20">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Welcome Back 👋
        </h1>

        <p className="text-lg text-gray-300 max-w-md">
          Login to continue managing your team, employees, and assessments seamlessly using Evalur.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">

        <Card className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
          
          <CardContent className="p-8 space-y-5 text-white">

            <div className="text-center">
              <h2 className="text-3xl font-bold">Login</h2>
              <p className="text-sm text-gray-300">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <Input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-2 focus:ring-white/30"
              />

              <Input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-2 focus:ring-white/30"
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-semibold py-2 rounded-lg transition"
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-300">
              Don’t have an account?{" "}
              <span
                className="text-white font-medium cursor-pointer hover:underline"
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
>>>>>>> Stashed changes
}