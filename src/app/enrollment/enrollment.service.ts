import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  enrollments,
  students,
  subjects,
  semesters,
  academicYears,
} from "../../db/schema.js";

import type {
  CreateEnrollmentInput,
  UpdateEnrollmentStatusInput,
} from "./enrollment.validator.js";
export const createEnrollment =
  async (
    data: CreateEnrollmentInput,
  ) => {
    /*
     * 1. Check student
     */
    const [student] =
      await db
        .select()
        .from(students)
        .where(
          eq(
            students.userId,
            data.studentId,
          ),
        );

    if (!student) {
      throw new Error(
        "Student not found.",
      );
    }


    /*
     * 2. Check subject
     */
    const [subject] =
      await db
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


    /*
     * 3. Check semester
     */
    const [semester] =
      await db
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


    /*
     * 4. Check academic year
     */
    const [academicYear] =
      await db
        .select()
        .from(academicYears)
        .where(
          eq(
            academicYears.id,
            data.academicYearId,
          ),
        );

    if (!academicYear) {
      throw new Error(
        "Academic year not found.",
      );
    }


    /*
     * 5. Student must belong
     *    to selected semester
     */
    if (
      student.currentSemesterId !==
      data.semesterId
    ) {
      throw new Error(
        "Student is not currently in this semester.",
      );
    }


    /*
     * 6. Subject must belong
     *    to student's branch
     */
    if (
      subject.branchId !==
      student.branchId
    ) {
      throw new Error(
        "Subject does not belong to student's branch.",
      );
    }


    /*
     * 7. Subject must belong
     *    to selected semester
     */
    if (
      subject.semesterId !==
      data.semesterId
    ) {
      throw new Error(
        "Subject does not belong to selected semester.",
      );
    }


    /*
     * 8. Check duplicate enrollment
     */
    const [existingEnrollment] =
      await db
        .select({
          id: enrollments.id,
        })
        .from(enrollments)
        .where(
          and(
            eq(
              enrollments.studentId,
              data.studentId,
            ),

            eq(
              enrollments.subjectId,
              data.subjectId,
            ),

            eq(
              enrollments.semesterId,
              data.semesterId,
            ),

            eq(
              enrollments.academicYearId,
              data.academicYearId,
            ),
          ),
        );

    if (existingEnrollment) {
      throw new Error(
        "Student is already enrolled in this subject for this academic year.",
      );
    }


    /*
     * 9. Create enrollment
     */
    const [enrollment] =
      await db
        .insert(enrollments)
        .values({
          studentId:
            data.studentId,

          subjectId:
            data.subjectId,

          semesterId:
            data.semesterId,

          academicYearId:
            data.academicYearId,

          status:
            data.status,
        })
        .returning();

    return enrollment;
  };
  export const getAllEnrollments =
  async () => {
    return await db
      .select({
        id: enrollments.id,

        studentId:
          students.userId,

        regNo:
          students.regNo,

        subjectId:
          subjects.id,

        subjectCode:
          subjects.subjectCode,

        subjectName:
          subjects.subjectName,

        credits:
          subjects.credits,

        semesterId:
          semesters.id,

        semesterNumber:
          semesters.semesterNumber,

        year:
          semesters.year,

        academicYearId:
          enrollments.academicYearId,

        status:
          enrollments.status,

        createdAt:
          enrollments.createdAt,

        updatedAt:
          enrollments.updatedAt,
      })
      .from(enrollments)

      .innerJoin(
        students,
        eq(
          enrollments.studentId,
          students.userId,
        ),
      )

      .innerJoin(
        subjects,
        eq(
          enrollments.subjectId,
          subjects.id,
        ),
      )

      .innerJoin(
        semesters,
        eq(
          enrollments.semesterId,
          semesters.id,
        ),
      );
  };
  export const getEnrollmentById =
  async (
    id: string,
  ) => {
    const [enrollment] =
      await db
        .select({
          id: enrollments.id,

          studentId:
            students.userId,

          regNo:
            students.regNo,

          subjectId:
            subjects.id,

          subjectCode:
            subjects.subjectCode,

          subjectName:
            subjects.subjectName,

          credits:
            subjects.credits,

          semesterId:
            semesters.id,

          semesterNumber:
            semesters.semesterNumber,

          year:
            semesters.year,

          academicYearId:
            enrollments.academicYearId,

          status:
            enrollments.status,

          createdAt:
            enrollments.createdAt,

          updatedAt:
            enrollments.updatedAt,
        })
        .from(enrollments)

        .innerJoin(
          students,
          eq(
            enrollments.studentId,
            students.userId,
          ),
        )

        .innerJoin(
          subjects,
          eq(
            enrollments.subjectId,
            subjects.id,
          ),
        )

        .innerJoin(
          semesters,
          eq(
            enrollments.semesterId,
            semesters.id,
          ),
        )

        .where(
          eq(
            enrollments.id,
            id,
          ),
        );

    if (!enrollment) {
      throw new Error(
        "Enrollment not found.",
      );
    }

    return enrollment;
  };
  export const getStudentEnrollments =
  async (
    studentId: string,
  ) => {
    /*
     * Check student
     */
    const [student] =
      await db
        .select({
          userId:
            students.userId,
        })
        .from(students)
        .where(
          eq(
            students.userId,
            studentId,
          ),
        );

    if (!student) {
      throw new Error(
        "Student not found.",
      );
    }


    /*
     * Get enrollments
     */
    return await db
      .select({
        enrollmentId:
          enrollments.id,

        subjectId:
          subjects.id,

        subjectCode:
          subjects.subjectCode,

        subjectName:
          subjects.subjectName,

        credits:
          subjects.credits,

        semesterId:
          semesters.id,

        semesterNumber:
          semesters.semesterNumber,

        year:
          semesters.year,

        academicYearId:
          enrollments.academicYearId,

        status:
          enrollments.status,

        createdAt:
          enrollments.createdAt,
      })
      .from(enrollments)

      .innerJoin(
        subjects,
        eq(
          enrollments.subjectId,
          subjects.id,
        ),
      )

      .innerJoin(
        semesters,
        eq(
          enrollments.semesterId,
          semesters.id,
        ),
      )

      .where(
        eq(
          enrollments.studentId,
          studentId,
        ),
      );
  };
  export const updateEnrollmentStatus =
  async (
    id: string,
    data: UpdateEnrollmentStatusInput,
  ) => {
    /*
     * Check enrollment
     */
    const [existingEnrollment] =
      await db
        .select({
          id: enrollments.id,
        })
        .from(enrollments)
        .where(
          eq(
            enrollments.id,
            id,
          ),
        );

    if (!existingEnrollment) {
      throw new Error(
        "Enrollment not found.",
      );
    }


    /*
     * Update status
     */
    const [updatedEnrollment] =
      await db
        .update(enrollments)
        .set({
          status: data.status,
        })
        .where(
          eq(
            enrollments.id,
            id,
          ),
        )
        .returning();

    return updatedEnrollment;
  };
  export const deleteEnrollment =
  async (
    id: string,
  ) => {
    const [existingEnrollment] =
      await db
        .select({
          id: enrollments.id,
        })
        .from(enrollments)
        .where(
          eq(
            enrollments.id,
            id,
          ),
        );

    if (!existingEnrollment) {
      throw new Error(
        "Enrollment not found.",
      );
    }


    await db
      .delete(enrollments)
      .where(
        eq(
          enrollments.id,
          id,
        ),
      );


    return {
      message:
        "Enrollment deleted successfully.",
    };
  };