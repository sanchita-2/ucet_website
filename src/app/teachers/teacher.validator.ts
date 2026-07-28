import { z } from "zod";

//Create Teacher
 
export const createTeacherSchema = z.object({
  userId: z.string().uuid("Invalid user id."),

  designation: z.enum([
    "assistant_professor",
    "associate_professor",
    "professor",
    "hod",
    
  ]),

  branchId: z.string().uuid("Invalid branch id."),
});

export type CreateTeacherInput = z.infer<
  typeof createTeacherSchema
>;

/**
 * Update Teacher
 */
export const updateTeacherSchema = z.object({
  designation: z
    .enum([
      "assistant_professor",
      "associate_professor",
      "professor",
      "hod",
      
    ])
    .optional(),

  branchId: z
    .string()
    .uuid("Invalid branch id.")
    .optional(),
});

export type UpdateTeacherInput = z.infer<
  typeof updateTeacherSchema
>;

/**
 * Teacher Id
 */
export const teacherIdSchema = z.object({
  userId: z.string().uuid(),
});