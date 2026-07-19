import { z } from "zod";

export const createBranchSchema = z.object({
  branchCode: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "Branch code must be at least 2 characters.")
    .max(20, "Branch code cannot exceed 20 characters."),

  branchName: z
    .string()
    .trim()
    .min(2, "Branch name must be at least 2 characters.")
    .max(255, "Branch name cannot exceed 255 characters."),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;

export const updateBranchSchema = z.object({
  branchCode: z.string().trim().toUpperCase().min(2).max(20).optional(),

  branchName: z.string().trim().min(2).max(255).optional(),
});

export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;

export const branchIdSchema = z.object({
  id: z.uuid("Invalid branch id."),
});

export type BranchIdInput = z.infer<typeof branchIdSchema>;
