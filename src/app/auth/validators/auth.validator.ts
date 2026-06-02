import { z } from "zod";
export const registerStudentSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "First name can contain only letters"
      ),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Last name can contain only letters"
      ),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    phone: z
      .string()
      .trim()
      .regex(
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian mobile number"
      ),

    gender: z.enum([
      "male",
      "female",
      "other",
      "prefer_not_to_say",
    ]),

    password: z
      .string()
      .min(8)
      .max(32)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/),

    // confirmPassword: z
    //   .string()
    //   .min(1, "Confirm password is required"),

    regNo: z
      .string()
      .trim()
      .min(1, "Registration number is required"),

    branchId: z
      .string()
      .uuid("Invalid branch id"),
  })
//   .refine(
//     (data) =>
//       data.password === data.confirmPassword,
//     {
//       message: "Passwords do not match",
//       path: ["confirmPassword"],
//     }
//   )
  ;

export type RegisterStudentInput =
  z.infer<typeof registerStudentSchema>;