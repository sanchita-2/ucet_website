import { z } from "zod";

export const registerStudentSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .regex(/^[A-Za-z\s]+$/, "First name can contain only letters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .regex(/^[A-Za-z\s]+$/, "Last name can contain only letters"),

    email: z.string().trim().toLowerCase().email("Invalid email address"),

    phone: z
      .string()
      .trim()
      .regex(
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian mobile number",
      ),

    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),

    password: z
      .string()
      .min(8)
      .max(32)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),

    regNo: z.string().trim().min(1, "Registration number is required"),

    rollNo: z.string().trim().min(1, "Roll number is required"),

    branchCode: z
      .string()
      .trim()
      .toUpperCase()
      .min(2, "Branch code is required")
      .max(10, "Invalid branch code"),

    dateOfAdmission: z.coerce.date(),

    admissionType: z.enum(["regular", "lateral_entry"]),

    entrySemesterNumber: z
      .number()
      .int("Semester must be an integer")
      .min(1, "Semester must be between 1 and 8")
      .max(8, "Semester must be between 1 and 8"),
  })
  .refine(
    (data) => {
      if (data.admissionType === "regular") {
        return data.entrySemesterNumber === 1;
      }

      if (data.admissionType === "lateral_entry") {
        return data.entrySemesterNumber === 3;
      }

      return true;
    },
    {
      message: "Invalid entry semester for the selected admission type",
      path: ["entrySemesterNumber"],
    },
  );

export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),

  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const verifyEmailSchema = z.object({
  email: z.string().email(),

  otp: z.string().length(6),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const verifyResetOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email(),

  otp: z.string().length(6),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),

  password: z
    .string()
    .min(8)
    .max(32)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[!@#$%^&*(),.?":{}|<>]/),
});
