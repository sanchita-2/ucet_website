import { z } from "zod";


export const createEnrollmentSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid student ID"),

  subjectId: z
    .string()
    .uuid("Invalid subject ID"),

  semesterId: z
    .string()
    .uuid("Invalid semester ID"),

  academicYearId: z
    .string()
    .uuid("Invalid academic year ID"),

  status: z.enum([
    "active",
    "completed",
    "dropped",
  ]),
});

export type CreateEnrollmentInput =
  z.infer<typeof createEnrollmentSchema>;


/**
 * Enrollment ID
 */
export const enrollmentIdSchema = z.object({
  id: z
    .string()
    .uuid("Invalid enrollment ID"),
});


/**
 * Student ID
 */
export const studentIdSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid student ID"),
});


/**
 * Update Enrollment Status
 */
export const updateEnrollmentStatusSchema =
  z.object({
    status: z.enum([
      "active",
      "completed",
      "dropped",
    ]),
  });

export type UpdateEnrollmentStatusInput =
  z.infer<
    typeof updateEnrollmentStatusSchema
  >;