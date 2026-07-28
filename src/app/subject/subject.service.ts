import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  subjects,
  branches,
  semesters,
} from "../../db/schema.js";

import type {
  CreateSubjectInput,
  UpdateSubjectInput,
} from "./subject.validator.js";

/**
 * Create Subject
 */
export const createSubject = async (
  data: CreateSubjectInput,
) => {

  /**
   * Subject Code must be unique
   */
  const [existingSubject] = await db
    .select()
    .from(subjects)
    .where(
      eq(
        subjects.subjectCode,
        data.subjectCode,
      ),
    );

  if (existingSubject) {
    throw new Error(
      "Subject code already exists.",
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
    throw new Error(
      "Branch not found.",
    );
  }

  /**
   * Verify Semester
   */
  const [semester] = await db
    .select()
    .from(semesters)
    .where(
      eq(
        semesters.id,
        data.semesterId,
      ),
    );

  if (!semester) {
    throw new Error(
      "Semester not found.",
    );
  }

  /**
   * Create Subject
   */
  const [subject] = await db
    .insert(subjects)
    .values({
      subjectCode: data.subjectCode,
      subjectName: data.subjectName,
      branchId: data.branchId,
      semesterId: data.semesterId,
      credits: data.credits,
      isActive: data.isActive ?? true,
    })
    .returning();

  return subject;
};

/**
 * Get All Subjects
 */
export const getAllSubjects = async () => {
  return await db
    .select({
      id: subjects.id,

      subjectCode:
        subjects.subjectCode,

      subjectName:
        subjects.subjectName,

      credits:
        subjects.credits,

      isActive:
        subjects.isActive,

      branchId:
        branches.id,

      branchName:
        branches.branchName,

      semesterId:
        semesters.id,

      semesterNumber:
        semesters.semesterNumber,

      year:
        semesters.year,

      createdAt:
        subjects.createdAt,
    })
    .from(subjects)
    .innerJoin(
      branches,
      eq(
        subjects.branchId,
        branches.id,
      ),
    )
    .innerJoin(
      semesters,
      eq(
        subjects.semesterId,
        semesters.id,
      ),
    );
};

/**
 * Get Subject By Id
 */
export const getSubjectById = async (
  id: string,
) => {
  const [subject] = await db
    .select({
      id: subjects.id,

      subjectCode:
        subjects.subjectCode,

      subjectName:
        subjects.subjectName,

      credits:
        subjects.credits,

      isActive:
        subjects.isActive,

      branchId:
        branches.id,

      branchName:
        branches.branchName,

      semesterId:
        semesters.id,

      semesterNumber:
        semesters.semesterNumber,

      year:
        semesters.year,

      createdAt:
        subjects.createdAt,
    })
    .from(subjects)
    .innerJoin(
      branches,
      eq(
        subjects.branchId,
        branches.id,
      ),
    )
    .innerJoin(
      semesters,
      eq(
        subjects.semesterId,
        semesters.id,
      ),
    )
    .where(eq(subjects.id, id));

  if (!subject) {
    throw new Error(
      "Subject not found.",
    );
  }

  return subject;
};

/**
 * Update Subject
 */
export const updateSubject = async (
  id: string,
  data: UpdateSubjectInput,
) => {

  /**
   * Check Subject Exists
   */
  const [existingSubject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id));

  if (!existingSubject) {
    throw new Error(
      "Subject not found.",
    );
  }

  /**
   * Subject Code must be unique
   */
  if (data.subjectCode) {
    const [duplicate] = await db
      .select()
      .from(subjects)
      .where(
        eq(
          subjects.subjectCode,
          data.subjectCode,
        ),
      );

    if (
      duplicate &&
      duplicate.id !== id
    ) {
      throw new Error(
        "Subject code already exists.",
      );
    }
  }

  /**
   * Verify Branch
   */
  if (data.branchId) {
    const [branch] = await db
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
   * Verify Semester
   */
  if (data.semesterId) {
    const [semester] = await db
      .select()
      .from(semesters)
      .where(
        eq(
          semesters.id,
          data.semesterId,
        ),
      );

    if (!semester) {
      throw new Error(
        "Semester not found.",
      );
    }
  }

  /**
   * Update Subject
   */
  const [updatedSubject] = await db
    .update(subjects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, id))
    .returning();

  return updatedSubject;
};

/**
 * Delete Subject
 */
export const deleteSubject = async (
  id: string,
) => {

  const [subject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id));

  if (!subject) {
    throw new Error(
      "Subject not found.",
    );
  }

  await db
    .delete(subjects)
    .where(eq(subjects.id, id));

  return {
    message:
      "Subject deleted successfully.",
  };
};

/**
 * Toggle Subject Status
 */
export const toggleSubjectStatus =
  async (id: string) => {

    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id));

    if (!subject) {
      throw new Error(
        "Subject not found.",
      );
    }

    const [updatedSubject] =
      await db
        .update(subjects)
        .set({
          isActive:
            !subject.isActive,
          updatedAt:
            new Date(),
        })
        .where(eq(subjects.id, id))
        .returning();

    return updatedSubject;
  };