import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  users,
  students,
  branches,
  semesters,
} from "../../db/schema.js";

import type {
  CreateStudentInput,
} from "./student.validator.js";

export const createStudent = async (
  data: CreateStudentInput,
) => {

  /**
   * Check whether the user exists
   */
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, data.userId));

  if (!user) {
    throw new Error("User not found.");
  }

  /**
   * Verify that the user has Student role
   */
  if (user.role !== "student") {
    throw new Error(
      "Selected user is not registered as a student.",
    );
  }

  /**
   * Check if student profile already exists
   */
  const [existingStudent] = await db
    .select()
    .from(students)
    .where(eq(students.userId, data.userId));

  if (existingStudent) {
    throw new Error(
      "Student profile already exists.",
    );
  }

  /**
   * Registration number must be unique
   */
  const [existingRegNo] = await db
    .select()
    .from(students)
    .where(eq(students.regNo, data.regNo));

  if (existingRegNo) {
    throw new Error(
      "Registration number already exists.",
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
        data.currentSemesterId,
      ),
    );

  if (!semester) {
    throw new Error(
      "Semester not found.",
    );
  }

  /**
   * Create Student Profile
   */
  const [student] = await db
    .insert(students)
    .values({
      userId: data.userId,
      regNo: data.regNo,
      branchId: data.branchId,
      currentSemesterId:
        data.currentSemesterId,
    })
    .returning();

  return student;
};

/**
 * Get All Students
 */
export const getAllStudents =
  async () => {
    return await db
      .select({
        userId: students.userId,

        regNo: students.regNo,

        firstName: users.firstName,
        lastName: users.lastName,

        email: users.email,

        phone: users.phone,

        gender: users.gender,

        branchName:
          branches.branchName,

        semester:
          semesters.semesterNumber,

        year: semesters.year,

        createdAt:
          students.createdAt,
      })
      .from(students)
      .innerJoin(
        users,
        eq(
          students.userId,
          users.id,
        ),
      )
      .innerJoin(
        branches,
        eq(
          students.branchId,
          branches.id,
        ),
      )
      .innerJoin(
        semesters,
        eq(
          students.currentSemesterId,
          semesters.id,
        ),
      );
  };
  /* Get Student By User ID
 */
export const getStudentById = async (
  userId: string,
) => {
  const [student] = await db
    .select({
      userId: students.userId,

      regNo: students.regNo,

      firstName: users.firstName,
      lastName: users.lastName,

      email: users.email,

      phone: users.phone,

      gender: users.gender,

      branchId: branches.id,
      branchName: branches.branchName,

      semesterId: semesters.id,
      semesterNumber:
        semesters.semesterNumber,

      year: semesters.year,

      createdAt:
        students.createdAt,
    })
    .from(students)
    .innerJoin(
      users,
      eq(students.userId, users.id),
    )
    .innerJoin(
      branches,
      eq(
        students.branchId,
        branches.id,
      ),
    )
    .innerJoin(
      semesters,
      eq(
        students.currentSemesterId,
        semesters.id,
      ),
    )
    .where(
      eq(students.userId, userId),
    );

  if (!student) {
    throw new Error(
      "Student not found.",
    );
  }

  return student;
};
/* Update Student
 */
export const updateStudent = async (
  userId: string,
  data: UpdateStudentInput,
) => {
  const [existingStudent] =
    await db
      .select()
      .from(students)
      .where(
        eq(students.userId, userId),
      );

  if (!existingStudent) {
    throw new Error(
      "Student not found.",
    );
  }

  if (
    data.regNo &&
    data.regNo !==
      existingStudent.regNo
  ) {
    const [duplicateRegNo] =
      await db
        .select()
        .from(students)
        .where(
          eq(
            students.regNo,
            data.regNo,
          ),
        );

    if (duplicateRegNo) {
      throw new Error(
        "Registration number already exists.",
      );
    }
  }

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

  if (data.currentSemesterId) {
    const [semester] =
      await db
        .select()
        .from(semesters)
        .where(
          eq(
            semesters.id,
            data.currentSemesterId,
          ),
        );

    if (!semester) {
      throw new Error(
        "Semester not found.",
      );
    }
  }

  const [updatedStudent] =
    await db
      .update(students)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        eq(
          students.userId,
          userId,
        ),
      )
      .returning();

  return updatedStudent;
};
/* Delete Student
 */
export const deleteStudent = async (
  userId: string,
) => {
  const [existingStudent] =
    await db
      .select()
      .from(students)
      .where(
        eq(students.userId, userId),
      );

  if (!existingStudent) {
    throw new Error(
      "Student not found.",
    );
  }

  await db
    .delete(students)
    .where(
      eq(students.userId, userId),
    );

  return {
    message:
      "Student deleted successfully.",
  };
};
//get student profile 
export const getMyProfile =
  async (userId: string) => {
    return await getStudentById(
      userId,
    );
  };