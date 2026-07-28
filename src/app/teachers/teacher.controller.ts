import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getMyProfile,
} from "./teacher.service.js";

import {
  createTeacherSchema,
  updateTeacherSchema,
  teacherIdSchema,
} from "./teacher.validator.js";

import type {
  CreateTeacherInput,
  UpdateTeacherInput,
} from "./teacher.validator.js";

/**
 * Create Teacher
 */
export const createTeacherController = async (
  req: Request<{}, {}, CreateTeacherInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData =
      createTeacherSchema.parse(req.body);

    const teacher =
      await createTeacher(validatedData);

    res.status(201).json({
      success: true,
      message:
        "Teacher created successfully.",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Teachers
 */
export const getAllTeachersController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const teachers =
        await getAllTeachers();

      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Teacher By Id
 */
export const getTeacherByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } =
        teacherIdSchema.parse(
          req.params,
        );

      const teacher =
        await getTeacherById(
          userId,
        );

      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Update Teacher
 */
export const updateTeacherController =
  async (
    req: Request<
      { userId: string },
      {},
      UpdateTeacherInput
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } =
        teacherIdSchema.parse(
          req.params,
        );

      const validatedData =
        updateTeacherSchema.parse(
          req.body,
        );

      const teacher =
        await updateTeacher(
          userId,
          validatedData,
        );

      res.status(200).json({
        success: true,
        message:
          "Teacher updated successfully.",
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Delete Teacher
 */
export const deleteTeacherController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } =
        teacherIdSchema.parse(
          req.params,
        );

      const result =
        await deleteTeacher(
          userId,
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Logged-in Teacher Profile
 */
export const getMyProfileController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const teacher =
        await getMyProfile(
          req.user.userId,
        );

      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  };