import * as z from "zod";

const blockedDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
];

export const organizationRegisterSchema = z
  .object({
    organizationName: z
      .string()
      .nonempty("Organization name is required")
      .min(2, "Organization name must be at least 2 characters"),

    domain: z
      .string()
      .nonempty("Domain is required")
      .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain"),

    
    email: z
      .string()
      .nonempty("Email is required") // ✅ FIRST
      .email("Invalid email format") // ✅ SECOND
      .refine((email) => {
        const parts = email.split("@");
        if (parts.length < 2) return false;
        return !blockedDomains.includes(parts[1]);
      }, "Use organization email (no Gmail/Yahoo)"),

    // 🔥 PASSWORD VALIDATION
    password: z
      .string()
      .nonempty("Password is required") // ✅ FIRST
      .min(6, "Password must be at least 6 characters"), // ✅ SECOND
  })

  
  .refine((data) => {
    const emailDomain = data.email.split("@")[1];
    return emailDomain === data.domain;
  }, {
    message: "Email must match organization domain",
    path: ["email"],
  });

export type OrganizationRegisterFormData = z.infer<
  typeof organizationRegisterSchema
>;