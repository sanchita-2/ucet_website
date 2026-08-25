import { z } from "zod";

export const createTimetableSchema =
  z.object({

    subjectId: z
      .string()
      .uuid("Invalid subject id"),

    teacherId: z
      .string()
      .uuid("Invalid teacher id"),

    branchId: z
      .string()
      .uuid("Invalid branch id"),

    semesterId: z
      .string()
      .uuid("Invalid semester id"),

    academicYearId: z
      .string()
      .uuid("Invalid academic year id"),

    section: z
      .string()
      .trim()
      .min(1)
      .max(10),

    day: z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ]),

    startTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
      ),

    endTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
      ),

    roomNo: z
      .string()
      .trim()
      .min(1)
      .max(50),
  });

export type CreateTimetableInput =
z.infer<typeof createTimetableSchema>;

export const updateTimetableSchema =
createTimetableSchema.partial();

export type UpdateTimetableInput =
z.infer<typeof updateTimetableSchema>;

export const timetableIdSchema =
z.object({
    id: z.string().uuid(),
});

export const teacherIdSchema =
z.object({
    teacherId: z.string().uuid(),
});

export const branchIdSchema =
z.object({
    branchId: z.string().uuid(),
});

export const semesterIdSchema =
z.object({
    semesterId: z.string().uuid(),
});