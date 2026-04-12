import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["EMPLOYEE", "MANAGER"]),
  organizationName: z.string().min(2, "Organization is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;