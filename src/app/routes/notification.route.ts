import { Router } from "express";

import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} from "../notifications/notification.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";

import { authorizeRole } from "../auth/middleware/authorize-role.js";

const notificationRouter = Router();


notificationRouter.get(
  "/",
  authenticate,
  getAllNotifications,
);

notificationRouter.get(
  "/:id",
  authenticate,
  getNotificationById,
);



notificationRouter.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  createNotification,
);

notificationRouter.put(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  updateNotification,
);

notificationRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteNotification,
);

export default notificationRouter;