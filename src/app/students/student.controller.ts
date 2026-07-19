import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getMyProfile,
} from "./student.service.js";

import {
  createStudentSchema,
  updateStudentSchema,
  studentIdSchema,
} from "./student.validator.js";

import type {
  CreateStudentInput,
  UpdateStudentInput,
} from "./student.validator.js";

/**
 * Create Student
 * Admin Only
 */
export const createStudentController = async (
  req: Request<{}, {}, CreateStudentInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData =
      createStudentSchema.parse(req.body);

    const result =
      await createStudent(validatedData);

    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Students
 */
export const getAllStudentsController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result =
        await getAllStudents();

      res.status(200).json({
        success: true,
        message:
          "Students fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Student By ID
 */
export const getStudentByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } =
        studentIdSchema.parse(req.params);

      const result =
        await getStudentById(userId);

      res.status(200).json({
        success: true,
        message:
          "Student fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Update Student
 */
export const updateStudentController =
  async (
    req: Request<
      { userId: string },
      {},
      UpdateStudentInput
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } =
        studentIdSchema.parse(req.params);

      const validatedData =
        updateStudentSchema.parse(
          req.body,
        );

      const result =
        await updateStudent(
          userId,
          validatedData,
        );

      res.status(200).json({
        success: true,
        message:
          "Student updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Delete Student
 */
export const deleteStudentController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } =
        studentIdSchema.parse(req.params);

      const result =
        await deleteStudent(userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Logged-in Student Profile
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

      const result =
        await getMyProfile(
          req.user.userId,
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };