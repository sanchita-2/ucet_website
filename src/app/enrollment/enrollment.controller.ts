import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  deleteEnrollment,
  getStudentEnrollments,
} from "./enrollment.service.js";

import {
  createEnrollmentSchema,
  enrollmentIdSchema,
  studentIdSchema,
} from "./enrollment.validator.js";
export const createEnrollmentController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData =
        createEnrollmentSchema.parse(
          req.body,
        );

      const enrollment =
        await createEnrollment(
          validatedData,
        );

      res.status(201).json({
        success: true,
        message:
          "Student enrolled in subject successfully.",
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  };
  export const getAllEnrollmentsController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const enrollments =
        await getAllEnrollments();

      res.status(200).json({
        success: true,
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  };
  export const getEnrollmentByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } =
        enrollmentIdSchema.parse(
          req.params,
        );

      const enrollment =
        await getEnrollmentById(id);

      res.status(200).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  };
  export const deleteEnrollmentController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } =
        enrollmentIdSchema.parse(
          req.params,
        );

      const result =
        await deleteEnrollment(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
  export const getMyEnrollmentsController =
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

      const enrollments =
        await getStudentEnrollments(
          req.user.userId,
        );

      res.status(200).json({
        success: true,
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  };
  export const getStudentEnrollmentsController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { studentId } =
        studentIdSchema.parse(
          req.params,
        );

      const enrollments =
        await getStudentEnrollments(
          studentId,
        );

      res.status(200).json({
        success: true,
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  };