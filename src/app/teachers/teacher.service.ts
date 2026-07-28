
import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  users,
  teachers,
  branches,
} from "../../db/schema.js";

import type {
  CreateTeacherInput,
  UpdateTeacherInput,
} from "./teacher.validator.js";

/**
 * Create Teacher
 */
export const createTeacher = async (
  data: CreateTeacherInput,
) => {

  /**
   * Check the user exists
   */
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, data.userId));

  if (!user) {
    throw new Error("User not found.");
  }

  /**
   * Verify user role
   */
  if (user.role !== "teacher") {
    throw new Error(
      "Selected user is not registered as a teacher.",
    );
  }

  /**
   * Check if teacher profile already exists
   */
  const [existingTeacher] = await db
    .select()
    .from(teachers)
    .where(eq(teachers.userId, data.userId));

  if (existingTeacher) {
    throw new Error(
      "Teacher profile already exists.",
    );
  }

  /**
   * Verify Branch
   */
  const [branch] = await db
    .select()
    .from(branches)
    .where(eq(branches.id, data.branchId));

  if (!branch) {
    throw new Error("Branch not found.");
  }

  /**
   * Create Teacher
   */
  const [teacher] = await db
    .insert(teachers)
    .values({
      userId: data.userId,
      designation: data.designation,
      branchId: data.branchId,
    })
    .returning();

  return teacher;
};

/**
 * Get All Teachers
 */
export const getAllTeachers =
  async () => {
    return await db
      .select({
        userId: teachers.userId,

        firstName: users.firstName,

        lastName: users.lastName,

        email: users.email,

        phone: users.phone,

        gender: users.gender,

        designation:
          teachers.designation,

        branchId:
          branches.id,

        branchName:
          branches.branchName,

        createdAt:
          teachers.createdAt,
      })
      .from(teachers)
      .innerJoin(
        users,
        eq(
          teachers.userId,
          users.id,
        ),
      )
      .innerJoin(
        branches,
        eq(
          teachers.branchId,
          branches.id,
        ),
      );
  };

  /**
 * Get Teacher By User ID
 */
export const getTeacherById = async (
  userId: string,
) => {
  const [teacher] = await db
    .select({
      userId: teachers.userId,

      firstName: users.firstName,
      lastName: users.lastName,

      email: users.email,
      phone: users.phone,

      gender: users.gender,

      designation:
        teachers.designation,

      branchId: branches.id,
      branchName:
        branches.branchName,

      createdAt:
        teachers.createdAt,
    })
    .from(teachers)
    .innerJoin(
      users,
      eq(
        teachers.userId,
        users.id,
      ),
    )
    .innerJoin(
      branches,
      eq(
        teachers.branchId,
        branches.id,
      ),
    )
    .where(
      eq(teachers.userId, userId),
    );

  if (!teacher) {
    throw new Error(
      "Teacher not found.",
    );
  }

  return teacher;
};



/**
 * Update Teacher
 */
export const updateTeacher = async (
  userId: string,
  data: UpdateTeacherInput,
) => {
  /**
   * Check Teacher Exists
   */
  const [existingTeacher] =
    await db
      .select()
      .from(teachers)
      .where(
        eq(
          teachers.userId,
          userId,
        ),
      );

  if (!existingTeacher) {
    throw new Error(
      "Teacher not found.",
    );
  }

  /**
   * Verify Branch
   */
  if (data.branchId) {
    const [branch] =
      await db
        .select()
        .from(branches)
        .where(
          eq(
            branches.id,
            data.branchId,
          ),
        );

    if (!branch) {
      throw new Error(
        "Branch not found.",
      );
    }
  }

  /**
   * Update Teacher
   */
  const [updatedTeacher] =
    await db
      .update(teachers)
      .set({
    ...data,
    updatedAt: new Date(),
})
      .where(
        eq(
          teachers.userId,
          userId,
        ),
      )
      .returning();

  return updatedTeacher;
};

/**
 * Delete Teacher
 */
export const deleteTeacher = async (
  userId: string,
) => {

  const [teacher] = await db
    .select()
    .from(teachers)
    .where(
      eq(
        teachers.userId,
        userId,
      ),
    );

  if (!teacher) {
    throw new Error(
      "Teacher not found.",
    );
  }

  await db
    .delete(teachers)
    .where(
      eq(
        teachers.userId,
        userId,
      ),
    );

  return {
    message:
      "Teacher deleted successfully.",
  };
};


/**
 * Logged-in Teacher Profile
 */
export const getMyProfile =
  async (userId: string) => {
    return await getTeacherById(
      userId,
    );
  };