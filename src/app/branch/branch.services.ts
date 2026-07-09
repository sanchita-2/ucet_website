import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { branches } from "../../db/schema.js";

import type {
  CreateBranchInput,
  UpdateBranchInput,
} from "./branch.validator.js";


export const createBranch = async (
  data: CreateBranchInput,
) => {
  // Check duplicate branch
  const [existingBranch] = await db
    .select()
    .from(branches)
    .where(
      eq(branches.branchName, data.branchName),
    );

  if (existingBranch) {
    throw new Error(
      "Branch already exists.",
    );
  }

  const [newBranch] = await db
    .insert(branches)
    .values({
      branchName: data.branchName,
    })
    .returning();

  return newBranch;
};


export const getAllBranches = async () => {
  return await db
    .select()
    .from(branches);
};


export const getBranchById = async (
  id: string,
) => {
  const [branch] = await db
    .select()
    .from(branches)
    .where(eq(branches.id, id));

  if (!branch) {
    throw new Error("Branch not found.");
  }

  return branch;
};
/* Update Branch
 */
export const updateBranch = async (
  id: string,
  data: UpdateBranchInput,
) => {
  const [existingBranch] = await db
    .select()
    .from(branches)
    .where(eq(branches.id, id));

  if (!existingBranch) {
    throw new Error("Branch not found.");
  }

  if (
    data.branchName &&
    data.branchName !== existingBranch.branchName
  ) {
    const [duplicateBranch] =
      await db
        .select()
        .from(branches)
        .where(
          eq(
            branches.branchName,
            data.branchName,
          ),
        );

    if (duplicateBranch) {
      throw new Error(
        "Branch name already exists.",
      );
    }
  }

  const [updatedBranch] = await db
    .update(branches)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(branches.id, id))
    .returning();

  return updatedBranch;
};

export const deleteBranch = async (
  id: string,
) => {
  const [existingBranch] = await db
    .select()
    .from(branches)
    .where(eq(branches.id, id));

  if (!existingBranch) {
    throw new Error("Branch not found.");
  }

  await db
    .delete(branches)
    .where(eq(branches.id, id));

  return {
    message:
      "Branch deleted successfully.",
  };
};