<<<<<<< Updated upstream
export const RegisterPage = () => {
  return (
    <div>    
      <h1>Register Page</h1>
=======
import { useForm } from "react-hook-form";
import { useRegister } from "../hooks/useRegister";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  role: string;
  organizationName: string;
};

export const RegisterPage = () => {
  const { register, handleSubmit } = useForm<RegisterFormData>();
  const { mutate, isPending } = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    mutate(data, {
      onSuccess: (res) => {
        console.log("Register Success:", res);
        alert("User Registered Successfully");
      },
      onError: (err) => {
        console.error(err);
        alert("Registration Failed");
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-20">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Build Your Team Faster 🚀
        </h1>

        <p className="text-lg text-gray-300 max-w-md">
          Create employees and managers for your organization.  
          Manage onboarding and assessments seamlessly using Evalur.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">

        <Card className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
          
          <CardContent className="p-8 space-y-5 text-white">

            <div>
              <h2 className="text-2xl font-semibold">Create User</h2>
              <p className="text-sm text-gray-300">
                Fill in the details below
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <Input
                {...register("name")}
                placeholder="Full Name"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-2 focus:ring-white/30"
              />

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

              <select
                {...register("role")}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="EMPLOYEE" className="text-black">
                  Employee
                </option>
                <option value="MANAGER" className="text-black">
                  Manager
                </option>
                <option value="ADMIN" className="text-black">
                  Admin
                </option>
              </select>

              <Input
                {...register("organizationName")}
                placeholder="Organization"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-2 focus:ring-white/30"
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-semibold py-2 rounded-lg transition"
              >
                {isPending ? "Creating..." : "Create User"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
>>>>>>> Stashed changes
    </div>
  )
}