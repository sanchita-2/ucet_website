import { z } from "zod";

export const createPlacementCellSchema = z.object({
  coordinatorId: z
    .string({ message: "Coordinator ID is required" })
    .uuid("Invalid UUID format for coordinatorId"),
  branchId: z
    .string({ message: "Branch ID is required" })
    .uuid("Invalid UUID format for branchId"),
  academicYearId: z
    .string({ message: "Academic Year ID is required" })
    .uuid("Invalid UUID format for academicYearId"),
  isActive: z.boolean().optional().default(true),
});

export const updatePlacementCellSchema = z
  .object({
    coordinatorId: z.string().uuid("Invalid coordinator ID").optional(),
    branchId: z.string().uuid("Invalid branch ID").optional(),
    academicYearId: z.string().uuid("Invalid academic year ID").optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type CreatePlacementCellInput = z.infer<
  typeof createPlacementCellSchema
>;
export type UpdatePlacementCellInput = z.infer<
  typeof updatePlacementCellSchema
>;