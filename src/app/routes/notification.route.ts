import { Router } from "express";

import {
  createNotificationController,
  getAllNotificationsController,
  updateNotificationController,
  deleteNotificationController,
} from "../notifications/notification.controller.js";

import { authenticate } from "../auth/middleware/authenticate.js";

const notificationRouter: Router = Router();


notificationRouter.get(
  "/",
  authenticate,
  getAllNotificationsController
);

notificationRouter.post(
  "/",
  authenticate,
  createNotificationController
);

notificationRouter.put(
  "/:id",
  authenticate,
  updateNotificationController
);

notificationRouter.delete(
  "/:id",
  authenticate,
  deleteNotificationController
);

export default notificationRouter;