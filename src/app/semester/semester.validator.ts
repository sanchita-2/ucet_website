import { z } from "zod";

export const createSemesterSchema = z.object({
  semesterNumber: z
    .number({
      error: "Semester number is required.",
    })
    .int("Semester must be an integer.")
    .min(1, "Semester must be between 1 and 8.")
    .max(8, "Semester must be between 1 and 8."),

  year: z
    .number({
      error: "Year is required.",
    })
    .int("Year must be an integer.")
    .min(1, "Year must be between 1 and 4.")
    .max(4, "Year must be between 1 and 4."),
});

export type CreateSemesterInput = z.infer<typeof createSemesterSchema>;

export const updateSemesterSchema = z.object({
  semesterNumber: z.number().int().min(1).max(8).optional(),

  year: z.number().int().min(1).max(4).optional(),
});

export type UpdateSemesterInput = z.infer<typeof updateSemesterSchema>;

export const semesterIdSchema = z.object({
  id: z.uuid("Invalid semester id."),
});

export type SemesterIdInput = z.infer<typeof semesterIdSchema>;
