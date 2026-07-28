import { Router } from "express";

import {
  assignSubjectController,
  getAllAssignmentsController,
  getAssignmentByIdController,
  getSubjectsByTeacherController,
  getTeachersBySubjectController,
  deleteAssignmentController,
} from "./teacherSubject.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";

import { authorizeRole } from "../auth/middleware/authorize-role.js";

const teacherSubjectRouter: Router =
  Router();

/**
 * Assign Subject
 */
teacherSubjectRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  assignSubjectController,
);

/**
 * Get All Assignments
 */
teacherSubjectRouter.get(
  "/",
  authenticate,
  authorizeRole("admin"),
  getAllAssignmentsController,
);

/**
 * Get Assignment By Id
 */
teacherSubjectRouter.get(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  getAssignmentByIdController,
);

/**
 * Get Subjects of Teacher
 */
teacherSubjectRouter.get(
  "/teacher/:teacherId",
  authenticate,
  authorizeRole(
    "admin",
    "teacher",
  ),
  getSubjectsByTeacherController,
);

/**
 * Get Teachers of Subject
 */
teacherSubjectRouter.get(
  "/subject/:subjectId",
  authenticate,
  authorizeRole("admin"),
  getTeachersBySubjectController,
);

/**
 * Delete Assignment
 */
teacherSubjectRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteAssignmentController,
);

export default teacherSubjectRouter;