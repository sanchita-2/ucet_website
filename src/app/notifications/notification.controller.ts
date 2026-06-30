import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
} from "./notification.service.js";

import type {
  CreateNotificationInput,
  UpdateNotificationInput,
} from "./notification.validator.js";

import {
  createNotificationSchema,
  updateNotificationSchema,
} from "./notification.validator.js";

/* Create Notification
 */
export const createNotificationController = async (
  req: Request<{}, {}, CreateNotificationInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData =
      createNotificationSchema.parse(req.body);

    const notification =
      await createNotification(validatedData);

    res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notifications =
      await getAllNotifications();

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};


export const updateNotificationController = async (
  req: Request<
    { id: string },
    {},
    UpdateNotificationInput
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData =
      updateNotificationSchema.parse(req.body);

    const notification =
      await updateNotification(
        Number(req.params.id),
        validatedData
      );

    res.status(200).json({
      success: true,
      message: "Notification updated successfully.",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotificationController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteNotification(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};