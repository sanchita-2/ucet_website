import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { semesters } from "../../db/schema.js";

import type {
  CreateSemesterInput,
  UpdateSemesterInput,
} from "./semester.validator.js";

/**
 * Create Semester
 */
export const createSemester = async (
  data: CreateSemesterInput,
) => {
  const [existingSemester] = await db
    .select()
    .from(semesters)
    .where(
      eq(
        semesters.semNumber,
        data.semNumber,
      ),
    );

  if (existingSemester) {
    throw new Error(
      "Semester already exists."
    );
  }

  const [newSemester] = await db
    .insert(semesters)
    .values({
      semNumber: data.semNumber,
    })
    .returning();

  return newSemester;
};

/**
 * Get All Semesters
 */
export const getAllSemesters =
  async () => {
    return await db
      .select()
      .from(semesters);
  };

/**
 * Get Semester By ID
 */
export const getSemesterById =
  async (id: string) => {
    const [semester] = await db
      .select()
      .from(semesters)
      .where(eq(semesters.id, id));

    if (!semester) {
      throw new Error(
        "Semester not found."
      );
    }

    return semester;
  };
  /**
 * Update Semester
 */
export const updateSemester =
  async (
    id: string,
    data: UpdateSemesterInput,
  ) => {
    const [existingSemester] =
      await db
        .select()
        .from(semesters)
        .where(
          eq(semesters.id, id),
        );

    if (!existingSemester) {
      throw new Error(
        "Semester not found."
      );
    }

    if (
      data.semNumber &&
      data.semNumber !==
        existingSemester.semNumber
    ) {
      const [duplicateSemester] =
        await db
          .select()
          .from(semesters)
          .where(
            eq(
              semesters.semNumber,
              data.semNumber,
            ),
          );

      if (duplicateSemester) {
        throw new Error(
          "Semester already exists."
        );
      }
    }

    const [updatedSemester] =
      await db
        .update(semesters)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          eq(semesters.id, id),
        )
        .returning();

    return updatedSemester;
  };

/**
 * Delete Semester
 */
export const deleteSemester =
  async (id: string) => {
    const [existingSemester] =
      await db
        .select()
        .from(semesters)
        .where(
          eq(semesters.id, id),
        );

    if (!existingSemester) {
      throw new Error(
        "Semester not found."
      );
    }

    await db
      .delete(semesters)
      .where(
        eq(semesters.id, id),
      );

    return {
      message:
        "Semester deleted successfully.",
    };
  };