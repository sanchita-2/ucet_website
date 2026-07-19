import { z } from "zod";


export const createStudentSchema = z.object({
  userId: z.uuid("Invalid user id."),

  regNo: z
    .string()
    .trim()
    .min(3, "Registration number is required.")
    .max(50, "Registration number is too long."),

  branchId: z.uuid("Invalid branch id."),

  currentSemesterId: z.uuid("Invalid semester id."),
});

export type CreateStudentInput = z.infer<
  typeof createStudentSchema
>;

export const updateStudentSchema = z.object({
  regNo: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .optional(),

  branchId: z.uuid().optional(),

  currentSemesterId: z.uuid().optional(),
});

export type UpdateStudentInput = z.infer<
  typeof updateStudentSchema
>;

export const studentIdSchema = z.object({
  userId: z.uuid("Invalid user id."),
});

export type StudentIdInput = z.infer<
  typeof studentIdSchema
>;