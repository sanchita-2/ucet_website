import { and, eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  users,
  teachers,
  subjects,
  branches,
  semesters,
  teacherSubjects,
} from "../../db/schema.js";

import type {
  AssignSubjectInput,
} from "./teacherSubject.validator.js";


/**
 * Assign Subject to Teacher
 */
export const assignSubject = async (
  data: AssignSubjectInput,
) => {

  /**
   * Verify Teacher
   */
  const [teacher] = await db
    .select()
    .from(teachers)
    .where(
      eq(
        teachers.userId,
        data.teacherId,
      ),
    );

  if (!teacher) {
    throw new Error(
      "Teacher not found.",
    );
  }

  /**
   * Verify Subject
   */
  const [subject] = await db
    .select()
    .from(subjects)
    .where(
      eq(
        subjects.id,
        data.subjectId,
      ),
    );

  if (!subject) {
    throw new Error(
      "Subject not found.",
    );
  }

  /**
   * Prevent duplicate assignment
   */
  const [existingAssignment] =
    await db
      .select()
      .from(teacherSubjects)
      .where(
        and(
          eq(
            teacherSubjects.teacherId,
            data.teacherId,
          ),
          eq(
            teacherSubjects.subjectId,
            data.subjectId,
          ),
        ),
      );

  if (existingAssignment) {
    throw new Error(
      "Subject already assigned to this teacher.",
    );
  }

  /**
   * Create Assignment
   */
  const [assignment] =
    await db
      .insert(teacherSubjects)
      .values({
        teacherId: data.teacherId,
        subjectId: data.subjectId,
      })
      .returning();

  return assignment;
};
/**
 * Get All Teacher Subject Assignments
 */
export const getAllAssignments =
  async () => {

    return await db
      .select({

        assignmentId:
          teacherSubjects.id,

        teacherId:
          teachers.userId,

        firstName:
          users.firstName,

        lastName:
          users.lastName,

        designation:
          teachers.designation,

        subjectId:
          subjects.id,

        subjectCode:
          subjects.subjectCode,

        subjectName:
          subjects.subjectName,

        credits:
          subjects.credits,

        branchName:
          branches.branchName,

        semesterNumber:
          semesters.semesterNumber,

        year:
          semesters.year,

        assignedAt:
          teacherSubjects.createdAt,
      })

      .from(
        teacherSubjects,
      )

      .innerJoin(
        teachers,
        eq(
          teacherSubjects.teacherId,
          teachers.userId,
        ),
      )

      .innerJoin(
        users,
        eq(
          teachers.userId,
          users.id,
        ),
      )

      .innerJoin(
        subjects,
        eq(
          teacherSubjects.subjectId,
          subjects.id,
        ),
      )

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
 * Get Assignment By Id
 */
export const getAssignmentById = async (
  id: string,
) => {

  const [assignment] = await db
    .select({
      assignmentId:
        teacherSubjects.id,

      teacherId:
        teachers.userId,

      firstName:
        users.firstName,

      lastName:
        users.lastName,

      designation:
        teachers.designation,

      subjectId:
        subjects.id,

      subjectCode:
        subjects.subjectCode,

      subjectName:
        subjects.subjectName,

      credits:
        subjects.credits,

      branchName:
        branches.branchName,

      semesterNumber:
        semesters.semesterNumber,

      year:
        semesters.year,

      assignedAt:
        teacherSubjects.createdAt,
    })
    .from(teacherSubjects)
    .innerJoin(
      teachers,
      eq(
        teacherSubjects.teacherId,
        teachers.userId,
      ),
    )
    .innerJoin(
      users,
      eq(
        teachers.userId,
        users.id,
      ),
    )
    .innerJoin(
      subjects,
      eq(
        teacherSubjects.subjectId,
        subjects.id,
      ),
    )
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
    .where(
      eq(
        teacherSubjects.id,
        id,
      ),
    );

  if (!assignment) {
    throw new Error(
      "Assignment not found.",
    );
  }

  return assignment;
};


/**
 * Get Subjects Assigned To Teacher
 */
export const getSubjectsByTeacher =
  async (
    teacherId: string,
  ) => {

    return await db
      .select({
        assignmentId:
          teacherSubjects.id,

        subjectId:
          subjects.id,

        subjectCode:
          subjects.subjectCode,

        subjectName:
          subjects.subjectName,

        credits:
          subjects.credits,

        branchName:
          branches.branchName,

        semesterNumber:
          semesters.semesterNumber,

        year:
          semesters.year,

        isActive:
          subjects.isActive,
      })
      .from(
        teacherSubjects,
      )
      .innerJoin(
        subjects,
        eq(
          teacherSubjects.subjectId,
          subjects.id,
        ),
      )
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
      .where(
        eq(
          teacherSubjects.teacherId,
          teacherId,
        ),
      );
  };


  /**
 * Get Teachers Assigned To Subject
 */
export const getTeachersBySubject =
  async (
    subjectId: string,
  ) => {

    return await db
      .select({
        assignmentId:
          teacherSubjects.id,

        teacherId:
          teachers.userId,

        firstName:
          users.firstName,

        lastName:
          users.lastName,

        email:
          users.email,

        phone:
          users.phone,

        designation:
          teachers.designation,
      })
      .from(
        teacherSubjects,
      )
      .innerJoin(
        teachers,
        eq(
          teacherSubjects.teacherId,
          teachers.userId,
        ),
      )
      .innerJoin(
        users,
        eq(
          teachers.userId,
          users.id,
        ),
      )
      .where(
        eq(
          teacherSubjects.subjectId,
          subjectId,
        ),
      );
  };


  /**
 * Delete Teacher Subject Assignment
 */
export const deleteAssignment =
  async (
    id: string,
  ) => {

    const [assignment] =
      await db
        .select()
        .from(
          teacherSubjects,
        )
        .where(
          eq(
            teacherSubjects.id,
            id,
          ),
        );

    if (!assignment) {
      throw new Error(
        "Assignment not found.",
      );
    }

    await db
      .delete(
        teacherSubjects,
      )
      .where(
        eq(
          teacherSubjects.id,
          id,
        ),
      );

    return {
      message:
        "Teacher subject assignment deleted successfully.",
    };
  };