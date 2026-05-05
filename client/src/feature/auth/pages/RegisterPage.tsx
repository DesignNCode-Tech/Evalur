"use client";

import { useEffect, useState, useMemo } from "react";
import { useRegister } from "../../auth/hooks/useRegister";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema/registerSchema";
import type { RegisterFormData } from '../schema/registerSchema';

// shadcn/ui components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const { mutate, isPending } = useRegister();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const inviteToken = searchParams.get("token");
  const decoded = useMemo(() => {
    if (inviteToken) {
      try {
        const payload = JSON.parse(atob(inviteToken.split(".")[1]));
        return payload;
      } catch (err) {
        console.error("Invalid invitation token", err);
        return null;
      }
    }
    return null;
  }, [inviteToken]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      organizationName: "",
      inviteToken: inviteToken || null,
    },
  });

  const isInvite = Boolean(inviteToken);

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    mutate(
      {
        ...data,
        seniorityLevel: decoded?.seniority || "JUNIOR",
        inviteToken: inviteToken || null,
      },
      {
        onSuccess: () => {
          navigate("/auth/login");
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-gradient-radial text-slate-800 font-sans rounded-2xl overflow-hidden shadow-lg">
      
      {/* BRANDING SIDE - Matching Login Page */}
      <div className="hidden md:flex flex-col justify-center px-16  text-white">
        <span className="text-5xl font-bold mb-6 tracking-tight">
          {isInvite && decoded ? decoded.orgName : "Evalur"}
        </span>
        <p className="text-slate-400 text-xl max-w-lg leading-relaxed">
          {isInvite
            ? "Your assessment environment is ready. Finish your profile to begin."
            : "Access your adaptive skill verification environment and manage organizational hiring context."}
        </p>
      </div>

      {/* REGISTRATION FORM SIDE */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md  bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-3xl font-bold">
              {isInvite ? "Welcome" : "Get Started"}
            </h2>
            <p className="text-slate-500 mt-2">
              {isInvite 
                ? "Fill in your details to join the organization." 
                : "Create your admin account to register your organization."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* FULL NAME */}
            <div className="mt-0">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <Input 
                {...register("name")} 
                placeholder="eg. Shreyash Bhosale" 
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* EMAIL */}
            <div className="mt-0">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input 
                type="email" 
                {...register("email")} 
                placeholder="name@example.com"
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div className="mt-0">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Input 
                type="password" 
                {...register("password")} 
                placeholder="••••••••"
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* ORGANIZATION NAME (Only for new registrations) */}
            {!isInvite && (
              <div className="mt-0">
                <label className="text-sm font-semibold text-slate-700">Organization Name</label>
                <Input 
                  {...register("organizationName")} 
                  placeholder="Evalur Corp"
                  className={errors.organizationName ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.organizationName && <p className="text-red-500 text-xs mt-1">{errors.organizationName.message}</p>}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11" 
              disabled={isPending}
            >
              {isPending ? "Setting up..." : isInvite ? "Join Team" : "Register Organization"}
            </Button>
          </form>

          {/* LOGIN REDIRECTION FOR EXISTING USERS */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="font-semibold text-slate-900 hover:underline">
                Sign in to your dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}