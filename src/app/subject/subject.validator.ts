import { z } from "zod";

/**
 * Create Subject
 */
export const createSubjectSchema = z.object({
  subjectCode: z
    .string()
    .trim()
    .min(2)
    .max(50),

  subjectName: z
    .string()
    .trim()
    .min(2)
    .max(255),

  branchId: z
    .string()
    .uuid("Invalid branch id."),

  semesterId: z
    .string()
    .uuid("Invalid semester id."),

  credits: z
    .number()
    .int()
    .min(1),

  isActive: z
    .boolean()
    .optional(),
});

export type CreateSubjectInput =
z.infer<typeof createSubjectSchema>;

/**
 * Update Subject
 */
export const updateSubjectSchema =
z.object({

  subjectCode: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  subjectName: z
    .string()
    .trim()
    .min(2)
    .max(255)
    .optional(),

  branchId: z
    .string()
    .uuid()
    .optional(),

  semesterId: z
    .string()
    .uuid()
    .optional(),

  credits: z
    .number()
    .int()
    .min(1)
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type UpdateSubjectInput =
z.infer<typeof updateSubjectSchema>;

export const subjectIdSchema =
z.object({
  id: z.string().uuid(),
});