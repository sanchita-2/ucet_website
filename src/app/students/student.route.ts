import { Router } from "express";

import {
  createStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
  deleteStudentController,
  getMyProfileController,
} from "../students/student.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";

import { authorizeRole } from "../auth/middleware/authorize-role.js";

const studentRouter: Router = Router();

/**
 * Student Profile
 */
studentRouter.get(
  "/profile/me",
  authenticate,
  authorizeRole("student"),
  getMyProfileController,
);

/**
 * Get All Students
 */
studentRouter.get(
  "/",
  authenticate,
  authorizeRole("admin"),
  getAllStudentsController,
);

/**
 * Get Student By Id
 */
studentRouter.get(
  "/:userId",
  authenticate,
  authorizeRole("admin"),
  getStudentByIdController,
);

/**
 * Create Student
 */
studentRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  createStudentController,
);

/**
 * Update Student
 */
studentRouter.patch(
  "/:userId",
  authenticate,
  authorizeRole("admin"),
  updateStudentController,
);

/**
 * Delete Student
 */
studentRouter.delete(
  "/:userId",
  authenticate,
  authorizeRole("admin"),
  deleteStudentController,
);

export default studentRouter;