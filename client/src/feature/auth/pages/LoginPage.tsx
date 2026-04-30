import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {  Link } from "react-router-dom";
import { useLogin } from "../../auth/hooks/useLogin"; // Assuming you have this hook

// shadcn/ui components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Define the Login Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Invalid credentials"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

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
  login(data);
};

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50 text-slate-900 font-sans">
      
      {/* BRANDING SIDE - Matching the Register Page style */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-slate-900 text-white">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">Evalur</h1>
        <p className="text-slate-400 text-xl max-w-lg leading-relaxed">
          Access your adaptive skill verification environment and manage organizational hiring context.
        </p>
      </div>

      {/* LOGIN FORM SIDE */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-slate-500 mt-2">
              Enter your credentials to access your tenant dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input 
                type="email" 
                {...register("email")} 
                placeholder="admin@evalur.com" 
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs text-slate-500 hover:text-slate-900">Forgot password?</a>
              </div>
              <Input 
                type="password" 
                {...register("password")} 
                placeholder="••••••••"
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11" 
              disabled={isPending}
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              New to Evalur?{" "}
              <Link to="/auth/register" className="font-semibold text-slate-900 hover:underline">
                Register your organization
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}