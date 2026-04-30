import { z } from "zod";

export const SeniorityLevel = z.enum([
  "INTERN",
  "JUNIOR",
  "MID",
  "SENIOR",
  "LEAD",
  "MANAGER",
  "EXECUTIVE",
  "CEO"
]);

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),

  organizationName: z.string().trim().optional(),
  
  inviteToken: z.string().nullable().optional(),
  
  // Defaulting to CEO for new organization registrations
  seniorityLevel: SeniorityLevel.default("CEO"),
})
.refine((data) => {
  // If this is a fresh registration (no invite token), Org Name is MANDATORY
  if (!data.inviteToken) {
    return data.organizationName && data.organizationName.length > 0;
  }
  return true;
}, {
  message: "Organization name is required for new accounts",
  path: ["organizationName"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;