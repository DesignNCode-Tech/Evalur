import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  role: z.enum(["CANDIDATE", "MANAGER", "EMPLOYEE"]),

  organizationName: z.string().min(2, "Organization required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;