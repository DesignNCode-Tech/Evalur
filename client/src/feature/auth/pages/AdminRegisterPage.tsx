import { useRegister } from "../hooks/useRegister";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema
} from "../schema/registerSchema";
import type { RegisterFormData} from '../schema/registerSchema'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminRegisterPage() {
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate({
      ...data,
      seniorityLevel: "SENIOR",
      inviteToken: null,
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100 text-black">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gray-200">
        <h1 className="text-4xl font-bold mb-4">
          Create Organization
        </h1>
        <p className="text-gray-700 text-lg">
          Set up your organization and start managing your team.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow">

          {/* HEADER */}
          <div>
            <h2 className="text-2xl font-semibold">
              Admin Registration
            </h2>
            <p className="text-gray-600 text-sm">
              Create your organization account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Organization */}
            <div>
              <label className="text-sm font-medium">
                Organization Name
              </label>
              <Input {...register("organizationName")} />
              {errors.organizationName && (
                <p className="text-red-500 text-sm">
                  {errors.organizationName.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Account"}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}