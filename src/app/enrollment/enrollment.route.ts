import { Router } from "express";

import {
  createEnrollmentController,
  getAllEnrollmentsController,
  getEnrollmentByIdController,
  deleteEnrollmentController,
  getMyEnrollmentsController,
  getStudentEnrollmentsController,
} from "../enrollment/enrollment.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";
import { authorizeRole } from "../auth/middleware/authorize-role.js";

const enrollmentRouter: Router =
  Router();


/**
 * ============================
 * ADMIN ROUTES
 * ============================
 */

/**
 * Create enrollment
 */
enrollmentRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  createEnrollmentController,
);


/**
 * Get all enrollments
 */
enrollmentRouter.get(
  "/",
  authenticate,
  authorizeRole("admin"),
  getAllEnrollmentsController,
);


/**
 * Get enrollments of a student
 */
enrollmentRouter.get(
  "/student/:studentId",
  authenticate,
  authorizeRole("admin"),
  getStudentEnrollmentsController,
);


/**
 * Get enrollment by ID
 */
enrollmentRouter.get(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  getEnrollmentByIdController,
);


/**
 * Delete enrollment
 */
enrollmentRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteEnrollmentController,
);


/**
 * ============================
 * STUDENT ROUTES
 * ============================
 */

/**
 * Get logged-in student's enrollments
 */
enrollmentRouter.get(
  "/student/my",
  authenticate,
  authorizeRole("student"),
  getMyEnrollmentsController,
);


export default enrollmentRouter;