import { useState } from "react";
import { useRegister } from "../hooks/useRegister";

export const RegisterPage = () => {
  const { mutate, isPending } = useRegister();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    organizationName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(form, {
      onSuccess: () => {
        alert("User created successfully ✅");
      },
      onError: (error: any) => {
        alert(
          error?.response?.data?.message ||
          "Failed to create user ❌"
        );
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white flex">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center px-16">

        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Build Your Team Faster 🚀
          </h1>

          <p className="text-lg text-gray-300">
            Create employees and managers for your organization.
            Manage onboarding seamlessly using Evalur.
          </p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">

          <h2 className="text-2xl font-semibold mb-2">Create User</h2>
          <p className="text-sm text-gray-300 mb-6">
            Fill in the details below
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-md bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-md bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-md bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {/* Role */}
            <select
              className="w-full p-3 rounded-md bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="EMPLOYEE" className="text-black">Employee</option>
              <option value="MANAGER" className="text-black">Manager</option>
            </select>

            {/* Organization */}
            <input
              type="text"
              placeholder="Organization"
              className="w-full p-3 rounded-md bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) =>
                setForm({ ...form, organizationName: e.target.value })
              }
            />

            {/* Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-md font-medium transition"
            >
              {isPending ? "Creating..." : "Create User"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};