import { z } from "zod";

/* Create Semester*/
export const createSemesterSchema = z.object({
  semNumber: z
    .number({
      error: "Semester number is required.",
    })
    .int("Semester must be an integer.")
    .min(1, "Semester must be between 1 and 8.")
    .max(8, "Semester must be between 1 and 8."),
});

export type CreateSemesterInput = z.infer<
  typeof createSemesterSchema
>;

/* Update Semester*/
export const updateSemesterSchema = z.object({
  semNumber: z
    .number()
    .int()
    .min(1)
    .max(8)
    .optional(),
});

export type UpdateSemesterInput = z.infer<
  typeof updateSemesterSchema
>;

/* Semester ID
 */
export const semesterIdSchema = z.object({
  id: z.uuid("Invalid semester id."),
});

export type SemesterIdInput = z.infer<
  typeof semesterIdSchema
>;