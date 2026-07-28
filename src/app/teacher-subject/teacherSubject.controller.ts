import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  assignSubject,
  getAllAssignments,
  getAssignmentById,
  getSubjectsByTeacher,
  getTeachersBySubject,
  deleteAssignment,
} from "./teacherSubject.service.js";

import {
  assignSubjectSchema,
  teacherSubjectIdSchema,
  teacherIdSchema,
  subjectIdSchema,
} from "./teacherSubject.validator.js";

import type {
  AssignSubjectInput,
} from "./teacherSubject.validator.js";

/**
 * Assign Subject to Teacher
 */
export const assignSubjectController = async (
  req: Request<{}, {}, AssignSubjectInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData =
      assignSubjectSchema.parse(req.body);

    const assignment =
      await assignSubject(validatedData);

    res.status(201).json({
      success: true,
      message:
        "Subject assigned successfully.",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Assignments
 */
export const getAllAssignmentsController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const assignments =
        await getAllAssignments();

      res.status(200).json({
        success: true,
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Assignment By Id
 */
export const getAssignmentByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        teacherSubjectIdSchema.parse(
          req.params,
        );

      const assignment =
        await getAssignmentById(id);

      res.status(200).json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Subjects By Teacher
 */
export const getSubjectsByTeacherController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { teacherId } =
        teacherIdSchema.parse(
          req.params,
        );

      const subjects =
        await getSubjectsByTeacher(
          teacherId,
        );

      res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Teachers By Subject
 */
export const getTeachersBySubjectController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { subjectId } =
        subjectIdSchema.parse(
          req.params,
        );

      const teachers =
        await getTeachersBySubject(
          subjectId,
        );

      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Delete Assignment
 */
export const deleteAssignmentController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        teacherSubjectIdSchema.parse(
          req.params,
        );

      const result =
        await deleteAssignment(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };