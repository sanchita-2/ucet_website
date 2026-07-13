import { Router } from "express";

import {
  createSemesterController,
  getAllSemestersController,
  getSemesterByIdController,
  updateSemesterController,
  deleteSemesterController,
} from "../semester/semester.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";
import { authorizeRole } from "../auth/middleware/authorize-role.js";

const semesterRouter: Router = Router();

/**
 * Get All Semesters
 */
semesterRouter.get(
  "/",
  authenticate,
  getAllSemestersController,
);

/**
 * Get Semester By ID
 */
semesterRouter.get(
  "/:id",
  authenticate,
  getSemesterByIdController,
);

/**
 * Create Semester
 */
semesterRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  createSemesterController,
);

/**
 * Update Semester
 */
semesterRouter.patch(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  updateSemesterController,
);

/**
 * Delete Semester
 */
semesterRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteSemesterController,
);

export default semesterRouter;