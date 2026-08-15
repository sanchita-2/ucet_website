import { Router } from "express";

import {
  createTimetableController,
  getAllTimetablesController,
  getTimetableByIdController,
  updateTimetableController,
  deleteTimetableController,
  getTeacherTimetableController,
  getMyTeacherTimetableController,
  getBranchTimetableController,
  getSemesterTimetableController,
  getStudentTimetableController,
} from "../timetable/timetable.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";

import { authorizeRole } from "../auth/middleware/authorize-role.js";

const timetableRouter: Router =
  Router();
  timetableRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  createTimetableController,
);

timetableRouter.get(
  "/",
  authenticate,
  authorizeRole("admin"),
  getAllTimetablesController,
);

timetableRouter.get(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  getTimetableByIdController,
);

timetableRouter.patch(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  updateTimetableController,
);

timetableRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteTimetableController,
);
timetableRouter.get(
  "/teacher/my",
  authenticate,
  authorizeRole("teacher"),
  getMyTeacherTimetableController,
);

timetableRouter.get(
  "/teacher/:teacherId",
  authenticate,
  authorizeRole(
    "admin",
    "teacher",
  ),
  getTeacherTimetableController,
);
timetableRouter.get(
  "/teacher/:teacherId",
  authenticate,
  authorizeRole("admin"),
  getTeacherTimetableController,
);
timetableRouter.get(
  "/branch/:branchId",
  authenticate,
  authorizeRole("admin"),
  getBranchTimetableController,
);

timetableRouter.get(
  "/semester/:semesterId",
  authenticate,
  authorizeRole("admin"),
  getSemesterTimetableController,
);
timetableRouter.get(
  "/student/my",
  authenticate,
  authorizeRole("student"),
  getStudentTimetableController,
);
export default timetableRouter;