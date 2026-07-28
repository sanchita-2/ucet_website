import { Router } from "express";

import {
  createTeacherController,
  getAllTeachersController,
  getTeacherByIdController,
  updateTeacherController,
  deleteTeacherController,
  getMyProfileController,
} from "../teachers/teacher.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";

import { authorizeRole } from "../auth/middleware/authorize-role.js";

const teacherRouter: Router =
  Router();

/**
 * Teacher Profile
 */
teacherRouter.get(
  "/profile/me",
  authenticate,
  authorizeRole("teacher"),
  getMyProfileController,
);

/**
 * Get All Teachers
 */
teacherRouter.get(
  "/",
  authenticate,
  authorizeRole("admin"),
  getAllTeachersController,
);

/**
 * Get Teacher By Id
 */
teacherRouter.get(
  "/:userId",
  authenticate,
  authorizeRole("admin"),
  getTeacherByIdController,
);

/**
 * Create Teacher
 */
teacherRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  createTeacherController,
);

/**
 * Update Teacher
 */
teacherRouter.patch(
  "/:userId",
  authenticate,
  authorizeRole("admin"),
  updateTeacherController,
);

/**
 * Delete Teacher
 */
teacherRouter.delete(
  "/:userId",
  authenticate,
  authorizeRole("admin"),
  deleteTeacherController,
);

export default teacherRouter;