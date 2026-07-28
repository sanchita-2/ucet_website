import { z } from "zod";

/**
 * Assign Subject to Teacher
 */
export const assignSubjectSchema = z.object({
  teacherId: z
    .string()
    .uuid("Invalid teacher id."),

  subjectId: z
    .string()
    .uuid("Invalid subject id."),
});

export type AssignSubjectInput =
z.infer<typeof assignSubjectSchema>;

/**
 * Mapping Id
 */
export const teacherSubjectIdSchema =
z.object({
  id: z.string().uuid(),
});

/**
 * Teacher Id
 */
export const teacherIdSchema =
z.object({
  teacherId: z.string().uuid(),
});

/**
 * Subject Id
 */
export const subjectIdSchema =
z.object({
  subjectId: z.string().uuid(),
});