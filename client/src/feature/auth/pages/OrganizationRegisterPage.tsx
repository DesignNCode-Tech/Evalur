import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {organizationRegisterSchema} from "../schema/organizationRegisterSchema";
import type {OrganizationRegisterFormData} from "../schema/organizationRegisterSchema"
import { useOrganizationRegister } from "../hooks/useOrganizationRegister";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function OrganizationRegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useOrganizationRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationRegisterFormData>({
    resolver: zodResolver(organizationRegisterSchema),
  });

  const onSubmit = (data: OrganizationRegisterFormData) => {
    mutate(data, {
      onSuccess: () => {
        alert("Organization created successfully");
        navigate("/login");
      },
      onError: () => {
        alert("Registration failed");
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-6 hidden md:block">
         <h1 className="text-4xl font-bold">
            Evalur 
          </h1>

          <p className="text-muted-foreground text-lg">
            A platform designed to streamline assessment processes,
            enable structured workflows, and provide a seamless
            experience for organizations and users.
          </p>
         
        </div>

        {/* RIGHT SIDE */}
        <Card className="w-full">
          <CardContent className="p-8 space-y-6">

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                Organization Signup
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your details
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* NAME */}
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input {...register("organizationName")} />
                {errors.organizationName && (
                  <p className="text-sm text-destructive">
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

              {/* DOMAIN */}
              <div className="space-y-2">
                <Label>Organization Domain</Label>
                <Input placeholder="example.com" {...register("domain")} />
                {errors.domain && (
                  <p className="text-sm text-destructive">
                    {errors.domain.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Admin Email</Label>
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
                {isPending ? "Creating..." : "Create Organization"}
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