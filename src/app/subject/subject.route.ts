import { Router } from "express";

import {
  createSubjectController,
  getAllSubjectsController,
  getSubjectByIdController,
  updateSubjectController,
  deleteSubjectController,
  toggleSubjectStatusController,
} from "../subject/subject.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";

import { authorizeRole } from "../auth/middleware/authorize-role.js";

const subjectRouter: Router =
  Router();

/**
 * Get All Subjects
 */
subjectRouter.get(
  "/",
  authenticate,
  authorizeRole(
    "admin",
    "teacher",
  ),
  getAllSubjectsController,
);

/**
 * Get Subject By Id
 */
subjectRouter.get(
  "/:id",
  authenticate,
  authorizeRole(
    "admin",
    "teacher",
  ),
  getSubjectByIdController,
);

/**
 * Create Subject
 */
subjectRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  createSubjectController,
);

/**
 * Update Subject
 */
subjectRouter.patch(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  updateSubjectController,
);

/**
 * Delete Subject
 */
subjectRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteSubjectController,
);

/**
 * Activate / Deactivate Subject
 */
subjectRouter.patch(
  "/:id/toggle-status",
  authenticate,
  authorizeRole("admin"),
  toggleSubjectStatusController,
);

export default subjectRouter;