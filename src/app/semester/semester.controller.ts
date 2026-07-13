import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
} from "./semester.service.js";

import {
  createSemesterSchema,
  updateSemesterSchema,
  semesterIdSchema,
} from "./semester.validator.js";

import type {
  CreateSemesterInput,
  UpdateSemesterInput,
} from "./semester.validator.js";

/**
 * Create Semester
 */
export const createSemesterController = async (
  req: Request<{}, {}, CreateSemesterInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData =
      createSemesterSchema.parse(req.body);

    const result = await createSemester(
      validatedData,
    );

    res.status(201).json({
      success: true,
      message: "Semester created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Semesters
 */
export const getAllSemestersController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result =
        await getAllSemesters();

      res.status(200).json({
        success: true,
        message:
          "Semesters fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Semester By ID
 */
export const getSemesterByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        semesterIdSchema.parse(
          req.params,
        );

      const result =
        await getSemesterById(id);

      res.status(200).json({
        success: true,
        message:
          "Semester fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Update Semester
 */
export const updateSemesterController =
  async (
    req: Request<
      { id: string },
      {},
      UpdateSemesterInput
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        semesterIdSchema.parse(
          req.params,
        );

      const validatedData =
        updateSemesterSchema.parse(
          req.body,
        );

      const result =
        await updateSemester(
          id,
          validatedData,
        );

      res.status(200).json({
        success: true,
        message:
          "Semester updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Delete Semester
 */
export const deleteSemesterController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        semesterIdSchema.parse(
          req.params,
        );

      const result =
        await deleteSemester(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };