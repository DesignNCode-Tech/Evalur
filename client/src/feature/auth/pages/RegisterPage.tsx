import { useEffect, useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema
} from "../schema/registerSchema";
import type { RegisterFormData} from '../schema/registerSchema'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const { mutate, isPending } = useRegister();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const inviteToken = searchParams.get("token");
  const [decoded, setDecoded] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Decode invite token
  useEffect(() => {
    if (inviteToken) {
      try {
        const payload = JSON.parse(atob(inviteToken.split(".")[1]));
        setDecoded(payload);
      } catch {
        console.error("Invalid token");
      }
    }
  }, [inviteToken]);

  const onSubmit = (data: RegisterFormData) => {
    mutate({
      ...data,
      seniorityLevel: decoded?.seniority || "JUNIOR",
      inviteToken: inviteToken || null,
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100 text-black">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gray-200">
        <h1 className="text-4xl font-bold mb-4 text-black">
          Create Your Account
        </h1>
        {/* <p className="text-gray-700 text-lg">
          Manage your team, employees, and onboarding seamlessly.
        </p> */}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow">

          {/* HEADER */}
          <div>
            <h2 className="text-2xl font-semibold text-black">
              {inviteToken ? "Join" : "Register"}
            </h2>

            <p className="text-gray-600 text-sm">
              Enter your details to create an account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-black">
                Full Name
              </label>
              <Input
                {...register("name")}
                className="bg-white text-black border"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-black">
                Email
              </label>
              <Input
                type="email"
                {...register("email")}
                className="bg-white text-black border"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-black">
                Password
              </label>
              <Input
                type="password"
                {...register("password")}
                className="bg-white text-black border"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ROLE (Invite only) */}
            {inviteToken && decoded && (
              <div>
                <label className="text-sm font-medium text-black">
                  Role
                </label>
                <select
                  value={decoded.role}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-100 text-black"
                >
                  <option>{decoded.role}</option>
                </select>
              </div>
            )}

            {/* ORGANIZATION */}
            {inviteToken && decoded ? (
              <div>
                <label className="text-sm font-medium text-black">
                  Organization
                </label>
                <Input
                  value={decoded.orgName}
                  disabled
                  className="bg-gray-100 text-black border"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-black">
                  Organization
                </label>
                <Input
                  {...register("organizationName")}
                  className="bg-white text-black border"
                />
              </div>
            )}

            {/* BUTTON */}
            <Button type="submit" className="w-full bg-black text-white" disabled={isPending}>
              {isPending
                ? "Processing..."
                : inviteToken
                ? "Join Organization"
                : "Create Account"}
            </Button>

            {/* LOGIN LINK */}
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium text-black cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}