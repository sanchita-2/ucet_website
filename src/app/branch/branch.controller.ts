import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "./branch.services.js";

import {
  createBranchSchema,
  updateBranchSchema,
  branchIdSchema,
} from "./branch.validator.js";

import type {
  CreateBranchInput,
  UpdateBranchInput,
} from "./branch.validator.js";

/**
 * Create Branch
 */
export const createBranchController = async (
  req: Request<{}, {}, CreateBranchInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData =
      createBranchSchema.parse(req.body);

    const result =
      await createBranch(validatedData);

    res.status(201).json({
      success: true,
      message: "Branch created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Branches
 */
export const getAllBranchesController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result =
        await getAllBranches();

      res.status(200).json({
        success: true,
        message:
          "Branches fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Branch By ID
 */
export const getBranchByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        branchIdSchema.parse(req.params);

      const result =
        await getBranchById(id);

      res.status(200).json({
        success: true,
        message:
          "Branch fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Update Branch
 */
export const updateBranchController =
  async (
    req: Request<
      { id: string },
      {},
      UpdateBranchInput
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        branchIdSchema.parse(req.params);

      const validatedData =
        updateBranchSchema.parse(req.body);

      const result =
        await updateBranch(
          id,
          validatedData,
        );

      res.status(200).json({
        success: true,
        message:
          "Branch updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Delete Branch
 */
export const deleteBranchController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } =
        branchIdSchema.parse(req.params);

      const result =
        await deleteBranch(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };