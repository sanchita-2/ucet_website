import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createTimetable,
  getAllTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
  getTeacherTimetable,
  getBranchTimetable,
  getSemesterTimetable,
  getStudentTimetable,
  getMyTeacherTimetable,
} from "./timetable.service.js";

import {
  createTimetableSchema,
  updateTimetableSchema,
  timetableIdSchema,
  teacherIdSchema,
  branchIdSchema,
  semesterIdSchema,
} from "./timetable.validator.js";
/**
 * Create Timetable
 */
export const createTimetableController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData =
      createTimetableSchema.parse(
        req.body,
      );

    const timetable =
      await createTimetable(
        validatedData,
      );

    res.status(201).json({
      success: true,
      message:
        "Timetable created successfully.",
      data: timetable,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Get All Timetables
 */
export const getAllTimetablesController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const timetables =
        await getAllTimetables();

      res.status(200).json({
        success: true,
        data: timetables,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
 * Get Timetable By ID
 */
export const getTimetableByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } =
        timetableIdSchema.parse(
          req.params,
        );

      const timetable =
        await getTimetableById(id);

      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
 * Update Timetable
 */
export const updateTimetableController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } =
        timetableIdSchema.parse(
          req.params,
        );

      const validatedData =
        updateTimetableSchema.parse(
          req.body,
        );

      const timetable =
        await updateTimetable(
          id,
          validatedData,
        );

      res.status(200).json({
        success: true,
        message:
          "Timetable updated successfully.",
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
 * Delete Timetable
 */
export const deleteTimetableController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } =
        timetableIdSchema.parse(
          req.params,
        );

      const result =
        await deleteTimetable(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
 * Get Timetable By Teacher
 */
export const getTeacherTimetableController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { teacherId } =
        teacherIdSchema.parse(
          req.params,
        );

      const timetable =
        await getTeacherTimetable(
          teacherId,
        );

      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
 * Get Logged-in Teacher's Timetable
 */
export const getMyTeacherTimetableController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });

        return;
      }

      const timetable =
        await getMyTeacherTimetable(
          req.user.userId,
        );

      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
 * Get Timetable By Branch
 */
export const getBranchTimetableController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { branchId } =
        branchIdSchema.parse(
          req.params,
        );

      const timetable =
        await getBranchTimetable(
          branchId,
        );

      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
 * Get Timetable By Semester
 */
export const getSemesterTimetableController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { semesterId } =
        semesterIdSchema.parse(
          req.params,
        );

      const timetable =
        await getSemesterTimetable(
          semesterId,
        );

      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
 * Get Logged-in Student's Timetable
 */
export const getStudentTimetableController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });

        return;
      }

      const timetable =
        await getStudentTimetable(
          req.user.userId,
        );

      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  };