import { Router } from "express";

import {
  createBranchController,
  getAllBranchesController,
  getBranchByIdController,
  updateBranchController,
  deleteBranchController,
} from "../branch/branch.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";

import { authorizeRole } from "../auth/middleware/authorize-role.js";

const branchRouter: Router = Router();

/**
 * Get All Branches
 * Any logged-in user
 */
branchRouter.get(
  "/",
  authenticate,
  getAllBranchesController,
);

/**
 * Get Branch By ID
 * Any logged-in user
 */
branchRouter.get(
  "/:id",
  authenticate,
  getBranchByIdController,
);

/**
 * Create Branch
 * Admin only
 */
branchRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  createBranchController,
);


branchRouter.patch(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  updateBranchController,
);


branchRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteBranchController,
);

export default branchRouter;