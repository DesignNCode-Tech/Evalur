import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema/registerSchema";
import type {RegisterFormData} from '../schema/registerSchema'
import { useRegister } from "../hooks/useRegister";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();
  const [searchParams] = useSearchParams();

  // ✅ ROLE FROM URL
  const roleFromUrl = searchParams.get("role");

  // ✅ VALIDATE ROLE
  const validRole =
    roleFromUrl === "MANAGER" ||
    roleFromUrl === "CANDIDATE" ||
    roleFromUrl === "EMPLOYEE"
      ? roleFromUrl
      : "CANDIDATE";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: validRole,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-6 hidden md:block">
          <h1 className="text-4xl font-bold">
            Join Evalur 
          </h1>

          <p className="text-muted-foreground text-lg">
            You’ve been invited to join a platform designed for smooth
            assessments and structured workflows. Create your account to get started.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <Card className="w-full">
          <CardContent className="p-8 space-y-6">

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Register</h2>
              <p className="text-sm text-muted-foreground">
                Complete your account setup
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* NAME */}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

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

              {/* ROLE (AUTO, READ ONLY) */}
              <input type="hidden" {...register("role")} value={validRole} />

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={
                    validRole === "CANDIDATE"
                      ? "Candidate"
                      : validRole === "MANAGER"
                      ? "Manager"
                      : "Employee"
                  }
                  disabled
                />
              </div>

              {/* ORGANIZATION */}
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input {...register("organizationName")} />
                {errors.organizationName && (
                  <p className="text-sm text-destructive">
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create Account"}
              </Button>

            </form>

            {/* FOOTER */}
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <span
                className="cursor-pointer underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}