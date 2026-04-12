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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(form, {
      onSuccess: (data) => {
        console.log("Register Success:", data);
        alert("User Registered Successfully ✅");
      },
      onError: (err: any) => {
        console.error(err);
        alert("Registration Failed ❌");
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

      {/* RIGHT SIDE FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10"
        >
          <h2 className="text-2xl font-semibold mb-2">Create User</h2>
          <p className="text-sm text-gray-300 mb-6">
            Fill in the details below
          </p>

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

          {/* ORGANIZATION */}
          <input
            type="text"
            name="organizationName"
            placeholder="Organization"
            value={form.organizationName}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-semibold"
          >
            {isPending ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};