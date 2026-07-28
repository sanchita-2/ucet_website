import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  toggleSubjectStatus,
} from "./subject.service.js";

import {
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdSchema,
} from "./subject.validator.js";

import type {
  CreateSubjectInput,
  UpdateSubjectInput,
} from "./subject.validator.js";

/**
 * Create Subject
 */
export const createSubjectController = async (
  req: Request<{}, {}, CreateSubjectInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData =
      createSubjectSchema.parse(req.body);

    const subject =
      await createSubject(validatedData);

    res.status(201).json({
      success: true,
      message:
        "Subject created successfully.",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Subjects
 */
export const getAllSubjectsController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const subjects =
        await getAllSubjects();

      res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Subject By Id
 */
export const getSubjectByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        subjectIdSchema.parse(
          req.params,
        );

      const subject =
        await getSubjectById(id);

      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Update Subject
 */
export const updateSubjectController =
  async (
    req: Request<
      { id: string },
      {},
      UpdateSubjectInput
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        subjectIdSchema.parse(
          req.params,
        );

      const validatedData =
        updateSubjectSchema.parse(
          req.body,
        );

      const subject =
        await updateSubject(
          id,
          validatedData,
        );

      res.status(200).json({
        success: true,
        message:
          "Subject updated successfully.",
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Delete Subject
 */
export const deleteSubjectController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        subjectIdSchema.parse(
          req.params,
        );

      const result =
        await deleteSubject(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Toggle Subject Status
 */
export const toggleSubjectStatusController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        subjectIdSchema.parse(
          req.params,
        );

      const subject =
        await toggleSubjectStatus(
          id,
        );

      res.status(200).json({
        success: true,
        message:
          "Subject status updated successfully.",
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  };