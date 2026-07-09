import { z } from "zod";

/* Create Branch
 */
export const createBranchSchema = z.object({
  branchName: z
    .string()
    .trim()
    .min(2, "Branch name must be at least 2 characters.")
    .max(255, "Branch name cannot exceed 255 characters."),
});

export type CreateBranchInput = z.infer<
  typeof createBranchSchema
>;

/* Update Branch
 */
export const updateBranchSchema = z.object({
  branchName: z
    .string()
    .trim()
    .min(2)
    .max(255)
    .optional(),
});

export type UpdateBranchInput = z.infer<
  typeof updateBranchSchema
>;

/* Branch ID
 */
export const branchIdSchema = z.object({
  id: z.uuid("Invalid branch id."),
});

export type BranchIdInput = z.infer<
  typeof branchIdSchema
>;