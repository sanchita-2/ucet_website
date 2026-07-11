import { eq, or } from "drizzle-orm";

import { db } from "../../db/index.js";
import { branches } from "../../db/schema.js";

import type {
  CreateBranchInput,
  UpdateBranchInput,
} from "./branch.validator.js";

export const createBranch = async (data: CreateBranchInput) => {
  const [existingBranch] = await db
    .select()
    .from(branches)
    .where(
      or(
        eq(branches.code, data.code),
        eq(branches.branchName, data.branchName),
      ),
    );

  if (existingBranch) {
    if (existingBranch.code === data.code) {
      throw new Error("Branch code already exists.");
    }

    throw new Error("Branch name already exists.");
  }

  const [newBranch] = await db
    .insert(branches)
    .values({
      code: data.code,
      branchName: data.branchName,
    })
    .returning();

  return newBranch;
};

export const getAllBranches = async () => {
  return await db.select().from(branches);
};

export const getBranchById = async (id: string) => {
  const [branch] = await db.select().from(branches).where(eq(branches.id, id));

  if (!branch) {
    throw new Error("Branch not found.");
  }

  return branch;
};

export const updateBranch = async (id: string, data: UpdateBranchInput) => {
  const [existingBranch] = await db
    .select()
    .from(branches)
    .where(eq(branches.id, id));

  if (!existingBranch) {
    throw new Error("Branch not found.");
  }

  if (data.code && data.code !== existingBranch.code) {
    const [duplicateCode] = await db
      .select()
      .from(branches)
      .where(eq(branches.code, data.code));

    if (duplicateCode) {
      throw new Error("Branch code already exists.");
    }
  }

  if (data.branchName && data.branchName !== existingBranch.branchName) {
    const [duplicateBranch] = await db
      .select()
      .from(branches)
      .where(eq(branches.branchName, data.branchName));

    if (duplicateBranch) {
      throw new Error("Branch name already exists.");
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

export const deleteBranch = async (id: string) => {
  const [existingBranch] = await db
    .select()
    .from(branches)
    .where(eq(branches.id, id));

  if (!existingBranch) {
    throw new Error("Branch not found.");
  }

  await db.delete(branches).where(eq(branches.id, id));

  return {
    message: "Branch deleted successfully.",
  };
};
