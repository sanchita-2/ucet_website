import {
  and,
  eq,
  ne,
} from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  timetables,
  subjects,
  teachers,
  branches,
  semesters,
  students,
  academicYears,
  teacherSubjects,
  users,
} from "../../db/schema.js";

import type {
  CreateTimetableInput,
  UpdateTimetableInput,
} from "./timetable.validator.js";
/**
 * Create Timetable
 */
export const createTimetable = async (
  data: CreateTimetableInput,
) => {

  /**
   * Subject Exists
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
   * Teacher Exists
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
   * Branch Exists
   */
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

  /**
   * Semester Exists
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
   * Academic Year Exists
   */
  const [academicYear] = await db
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
    if (
    subject.branchId !==
    data.branchId
  ) {
    throw new Error(
      "Subject does not belong to selected branch.",
    );
  }
    if (
    subject.semesterId !==
    data.semesterId
  ) {
    throw new Error(
      "Subject does not belong to selected semester.",
    );
  }
    if (
    teacher.branchId !==
    data.branchId
  ) {
    throw new Error(
      "Teacher does not belong to selected branch.",
    );
  }
    const [assignment] = await db
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

  if (!assignment) {
    throw new Error(
      "Teacher is not assigned to teach this subject.",
    );
  }
    if (
    data.startTime >=
    data.endTime
  ) {
    throw new Error(
      "End time must be after start time.",
    );
  }
    const [sectionConflict] =
    await db
      .select()
      .from(timetables)
      .where(
        and(
          eq(
            timetables.academicYearId,
            data.academicYearId,
          ),

          eq(
            timetables.branchId,
            data.branchId,
          ),

          eq(
            timetables.semesterId,
            data.semesterId,
          ),

          eq(
            timetables.section,
            data.section,
          ),

          eq(
            timetables.day,
            data.day,
          ),

          eq(
            timetables.startTime,
            data.startTime,
          ),

          eq(
            timetables.endTime,
            data.endTime,
          ),
        ),
      );

  if (sectionConflict) {
    throw new Error(
      "Section already has a lecture during this time.",
    );
  }
    const [teacherConflict] =
    await db
      .select()
      .from(timetables)
      .where(
        and(
          eq(
            timetables.academicYearId,
            data.academicYearId,
          ),

          eq(
            timetables.teacherId,
            data.teacherId,
          ),

          eq(
            timetables.day,
            data.day,
          ),

          eq(
            timetables.startTime,
            data.startTime,
          ),

          eq(
            timetables.endTime,
            data.endTime,
          ),
        ),
      );

  if (teacherConflict) {
    throw new Error(
      "Teacher already has another class during this time.",
    );
  }
    const [roomConflict] =
    await db
      .select()
      .from(timetables)
      .where(
        and(
          eq(
            timetables.academicYearId,
            data.academicYearId,
          ),

          eq(
            timetables.roomNo,
            data.roomNo,
          ),

          eq(
            timetables.day,
            data.day,
          ),

          eq(
            timetables.startTime,
            data.startTime,
          ),

          eq(
            timetables.endTime,
            data.endTime,
          ),
        ),
      );

  if (roomConflict) {
    throw new Error(
      "Room already occupied during this time.",
    );
  }
    const [timetable] =
    await db
      .insert(timetables)
      .values(data)
      .returning();

  return timetable;
};
/**
 * Get All Timetables
 */
export const getAllTimetables = async () => {
  return await db
    .select({
      id: timetables.id,

      subjectId: subjects.id,
      subjectCode: subjects.subjectCode,
      subjectName: subjects.subjectName,
      credits: subjects.credits,

      teacherId: teachers.userId,
      teacherFirstName: users.firstName,
      teacherLastName: users.lastName,
      teacherDesignation: teachers.designation,

      branchId: branches.id,
      branchName: branches.branchName,

      semesterId: semesters.id,
      semesterNumber: semesters.semesterNumber,
      year: semesters.year,

      section: timetables.section,
      day: timetables.day,
      startTime: timetables.startTime,
      endTime: timetables.endTime,
      roomNo: timetables.roomNo,

      academicYearId: timetables.academicYearId,

      createdAt: timetables.createdAt,
      updatedAt: timetables.updatedAt,
    })
    .from(timetables)

    .innerJoin(
      subjects,
      eq(
        timetables.subjectId,
        subjects.id,
      ),
    )

    .innerJoin(
      teachers,
      eq(
        timetables.teacherId,
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
      branches,
      eq(
        timetables.branchId,
        branches.id,
      ),
    )

    .innerJoin(
      semesters,
      eq(
        timetables.semesterId,
        semesters.id,
      ),
    );
};
/**
 * Get Timetable By ID
 */
export const getTimetableById = async (
  id: string,
) => {
  const [timetable] = await db
    .select({
      id: timetables.id,

      subjectId: subjects.id,
      subjectCode: subjects.subjectCode,
      subjectName: subjects.subjectName,
      credits: subjects.credits,

      teacherId: teachers.userId,
      teacherFirstName: users.firstName,
      teacherLastName: users.lastName,
      teacherDesignation: teachers.designation,

      branchId: branches.id,
      branchName: branches.branchName,

      semesterId: semesters.id,
      semesterNumber: semesters.semesterNumber,
      year: semesters.year,

      section: timetables.section,
      day: timetables.day,
      startTime: timetables.startTime,
      endTime: timetables.endTime,
      roomNo: timetables.roomNo,

      academicYearId: timetables.academicYearId,

      createdAt: timetables.createdAt,
      updatedAt: timetables.updatedAt,
    })
    .from(timetables)

    .innerJoin(
      subjects,
      eq(
        timetables.subjectId,
        subjects.id,
      ),
    )

    .innerJoin(
      teachers,
      eq(
        timetables.teacherId,
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
      branches,
      eq(
        timetables.branchId,
        branches.id,
      ),
    )

    .innerJoin(
      semesters,
      eq(
        timetables.semesterId,
        semesters.id,
      ),
    )

    .where(
      eq(
        timetables.id,
        id,
      ),
    );

  if (!timetable) {
    throw new Error(
      "Timetable entry not found.",
    );
  }

  return timetable;
};
/**
 * Update Timetable
 */
export const updateTimetable = async (
  id: string,
  data: UpdateTimetableInput,
) => {
  // Check existing timetable
  const [existingTimetable] =
    await db
      .select()
      .from(timetables)
      .where(
        eq(timetables.id, id),
      );

  if (!existingTimetable) {
    throw new Error(
      "Timetable entry not found.",
    );
  }

 
  const subjectId =
    data.subjectId ??
    existingTimetable.subjectId;

  const teacherId =
    data.teacherId ??
    existingTimetable.teacherId;

  const branchId =
    data.branchId ??
    existingTimetable.branchId;

  const semesterId =
    data.semesterId ??
    existingTimetable.semesterId;

  const academicYearId =
    data.academicYearId ??
    existingTimetable.academicYearId;

  const section =
    data.section ??
    existingTimetable.section;

  const day =
    data.day ??
    existingTimetable.day;

  const startTime =
    data.startTime ??
    existingTimetable.startTime;

  const endTime =
    data.endTime ??
    existingTimetable.endTime;

  const roomNo =
    data.roomNo ??
    existingTimetable.roomNo;

  
  if (startTime >= endTime) {
    throw new Error(
      "End time must be after start time.",
    );
  }
    const [subject] =
    await db
      .select()
      .from(subjects)
      .where(
        eq(
          subjects.id,
          subjectId,
        ),
      );

  if (!subject) {
    throw new Error(
      "Subject not found.",
    );
  }

  if (
    subject.branchId !==
    branchId
  ) {
    throw new Error(
      "Subject does not belong to selected branch.",
    );
  }

  if (
    subject.semesterId !==
    semesterId
  ) {
    throw new Error(
      "Subject does not belong to selected semester.",
    );
  }
    const [teacher] =
    await db
      .select()
      .from(teachers)
      .where(
        eq(
          teachers.userId,
          teacherId,
        ),
      );

  if (!teacher) {
    throw new Error(
      "Teacher not found.",
    );
  }

  if (
    teacher.branchId !==
    branchId
  ) {
    throw new Error(
      "Teacher does not belong to selected branch.",
    );
  }
    const [assignment] =
    await db
      .select()
      .from(teacherSubjects)
      .where(
        and(
          eq(
            teacherSubjects.teacherId,
            teacherId,
          ),
          eq(
            teacherSubjects.subjectId,
            subjectId,
          ),
        ),
      );

  if (!assignment) {
    throw new Error(
      "Teacher is not assigned to teach this subject.",
    );
  }
    const [sectionConflict] =
    await db
      .select()
      .from(timetables)
      .where(
        and(
          eq(
            timetables.academicYearId,
            academicYearId,
          ),

          eq(
            timetables.branchId,
            branchId,
          ),

          eq(
            timetables.semesterId,
            semesterId,
          ),

          eq(
            timetables.section,
            section,
          ),

          eq(
            timetables.day,
            day,
          ),

          eq(
            timetables.startTime,
            startTime,
          ),

          eq(
            timetables.endTime,
            endTime,
          ),

          ne(
            timetables.id,
            id,
          ),
        ),
      );

  if (sectionConflict) {
    throw new Error(
      "Section already has a lecture during this time.",
    );
  }
    const [teacherConflict] =
    await db
      .select()
      .from(timetables)
      .where(
        and(
          eq(
            timetables.academicYearId,
            academicYearId,
          ),

          eq(
            timetables.teacherId,
            teacherId,
          ),

          eq(
            timetables.day,
            day,
          ),

          eq(
            timetables.startTime,
            startTime,
          ),

          eq(
            timetables.endTime,
            endTime,
          ),

          ne(
            timetables.id,
            id,
          ),
        ),
      );

  if (teacherConflict) {
    throw new Error(
      "Teacher already has another class during this time.",
    );
  }
    const [roomConflict] =
    await db
      .select()
      .from(timetables)
      .where(
        and(
          eq(
            timetables.academicYearId,
            academicYearId,
          ),

          eq(
            timetables.roomNo,
            roomNo,
          ),

          eq(
            timetables.day,
            day,
          ),

          eq(
            timetables.startTime,
            startTime,
          ),

          eq(
            timetables.endTime,
            endTime,
          ),

          ne(
            timetables.id,
            id,
          ),
        ),
      );

  if (roomConflict) {
    throw new Error(
      "Room already occupied during this time.",
    );
  }
    const [updatedTimetable] =
    await db
      .update(timetables)
      .set({
        subjectId,
        teacherId,
        branchId,
        semesterId,
        section,
        day,
        startTime,
        endTime,
        roomNo,
        academicYearId,
      })
      .where(
        eq(
          timetables.id,
          id,
        ),
      )
      .returning();

  return updatedTimetable;
};
/**
 * Delete Timetable
 */
export const deleteTimetable = async (
  id: string,
) => {
  const [existingTimetable] =
    await db
      .select()
      .from(timetables)
      .where(
        eq(
          timetables.id,
          id,
        ),
      );

  if (!existingTimetable) {
    throw new Error(
      "Timetable entry not found.",
    );
  }

  await db
    .delete(timetables)
    .where(
      eq(
        timetables.id,
        id,
      ),
    );

  return {
    message:
      "Timetable entry deleted successfully.",
  };
};
/**
 * Get Timetable By Teacher
 */
export const getTeacherTimetable =
  async (
    teacherId: string,
  ) => {
    return await db
      .select({
        id: timetables.id,

        subjectId:
          subjects.id,

        subjectCode:
          subjects.subjectCode,

        subjectName:
          subjects.subjectName,

        credits:
          subjects.credits,

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

        section:
          timetables.section,

        day:
          timetables.day,

        startTime:
          timetables.startTime,

        endTime:
          timetables.endTime,

        roomNo:
          timetables.roomNo,

        academicYearId:
          timetables.academicYearId,
      })
      .from(timetables)

      .innerJoin(
        subjects,
        eq(
          timetables.subjectId,
          subjects.id,
        ),
      )

      .innerJoin(
        branches,
        eq(
          timetables.branchId,
          branches.id,
        ),
      )

      .innerJoin(
        semesters,
        eq(
          timetables.semesterId,
          semesters.id,
        ),
      )

      .where(
        eq(
          timetables.teacherId,
          teacherId,
        ),
      );
  };
  /**
 * Get Timetable By Branch
 */
export const getBranchTimetable = async (
  branchId: string,
) => {
  const branch = await db
    .select({
      id: branches.id,
      branchName: branches.branchName,
    })
    .from(branches)
    .where(
      eq(branches.id, branchId),
    );

  if (branch.length === 0) {
    throw new Error(
      "Branch not found.",
    );
  }

  return await db
    .select({
      id: timetables.id,

      subjectId: subjects.id,
      subjectCode: subjects.subjectCode,
      subjectName: subjects.subjectName,
      credits: subjects.credits,

      teacherId: teachers.userId,
      teacherFirstName: users.firstName,
      teacherLastName: users.lastName,
      teacherDesignation: teachers.designation,

      branchId: branches.id,
      branchName: branches.branchName,

      semesterId: semesters.id,
      semesterNumber: semesters.semesterNumber,
      year: semesters.year,

      section: timetables.section,
      day: timetables.day,
      startTime: timetables.startTime,
      endTime: timetables.endTime,
      roomNo: timetables.roomNo,

      academicYearId:
        timetables.academicYearId,

      createdAt: timetables.createdAt,
      updatedAt: timetables.updatedAt,
    })
    .from(timetables)

    .innerJoin(
      subjects,
      eq(
        timetables.subjectId,
        subjects.id,
      ),
    )

    .innerJoin(
      teachers,
      eq(
        timetables.teacherId,
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
      branches,
      eq(
        timetables.branchId,
        branches.id,
      ),
    )

    .innerJoin(
      semesters,
      eq(
        timetables.semesterId,
        semesters.id,
      ),
    )

    .where(
      eq(
        timetables.branchId,
        branchId,
      ),
    );
};
/**
 * Get Timetable By Semester
 */
export const getSemesterTimetable =
  async (
    semesterId: string,
  ) => {
    const semester = await db
      .select({
        id: semesters.id,
        semesterNumber:
          semesters.semesterNumber,
        year: semesters.year,
      })
      .from(semesters)
      .where(
        eq(
          semesters.id,
          semesterId,
        ),
      );

    if (semester.length === 0) {
      throw new Error(
        "Semester not found.",
      );
    }

    return await db
      .select({
        id: timetables.id,

        subjectId: subjects.id,
        subjectCode:
          subjects.subjectCode,
        subjectName:
          subjects.subjectName,
        credits: subjects.credits,

        teacherId:
          teachers.userId,
        teacherFirstName:
          users.firstName,
        teacherLastName:
          users.lastName,
        teacherDesignation:
          teachers.designation,

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

        section:
          timetables.section,
        day:
          timetables.day,
        startTime:
          timetables.startTime,
        endTime:
          timetables.endTime,
        roomNo:
          timetables.roomNo,

        academicYearId:
          timetables.academicYearId,

        createdAt:
          timetables.createdAt,
        updatedAt:
          timetables.updatedAt,
      })
      .from(timetables)

      .innerJoin(
        subjects,
        eq(
          timetables.subjectId,
          subjects.id,
        ),
      )

      .innerJoin(
        teachers,
        eq(
          timetables.teacherId,
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
        branches,
        eq(
          timetables.branchId,
          branches.id,
        ),
      )

      .innerJoin(
        semesters,
        eq(
          timetables.semesterId,
          semesters.id,
        ),
      )

      .where(
        eq(
          timetables.semesterId,
          semesterId,
        ),
      );
  };
  /**
 * Get Timetable For Student
 */
export const getStudentTimetable =
  async (
    userId: string,
  ) => {
    const [student] = await db
      .select({
        userId: students.userId,
        branchId: students.branchId,
        semesterId:
          students.currentSemesterId,
      })
      .from(students)
      .where(
        eq(
          students.userId,
          userId,
        ),
      );

    if (!student) {
      throw new Error(
        "Student profile not found.",
      );
    }

    return await db
      .select({
        id: timetables.id,

        subjectId: subjects.id,
        subjectCode:
          subjects.subjectCode,
        subjectName:
          subjects.subjectName,
        credits: subjects.credits,

        teacherId:
          teachers.userId,
        teacherFirstName:
          users.firstName,
        teacherLastName:
          users.lastName,

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

        section:
          timetables.section,
        day:
          timetables.day,
        startTime:
          timetables.startTime,
        endTime:
          timetables.endTime,
        roomNo:
          timetables.roomNo,

        academicYearId:
          timetables.academicYearId,
      })
      .from(timetables)

      .innerJoin(
        subjects,
        eq(
          timetables.subjectId,
          subjects.id,
        ),
      )

      .innerJoin(
        teachers,
        eq(
          timetables.teacherId,
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
        branches,
        eq(
          timetables.branchId,
          branches.id,
        ),
      )

      .innerJoin(
        semesters,
        eq(
          timetables.semesterId,
          semesters.id,
        ),
      )

      .where(
        and(
          eq(
            timetables.branchId,
            student.branchId,
          ),
          eq(
            timetables.semesterId,
            student.semesterId,
          ),
        ),
      );
  };
  /**
 * Get Timetable For Logged-in Teacher
 */
export const getMyTeacherTimetable =
  async (
    userId: string,
  ) => {
    return getTeacherTimetable(
      userId,
    );
  };