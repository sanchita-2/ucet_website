import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as notificationService from "./notification.service.js";

import {
  createNotificationSchema,
  updateNotificationSchema,
} from "./notification.validator.js";

export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const body = createNotificationSchema.parse(req.body);

    const notification =
      await notificationService.createNotification(
        body,
      
      );

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notifications =
      await notificationService.getAllNotifications();

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotificationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required.",
      });
    }

    const notification =
      await notificationService.getNotificationById(id);

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required.",
      });
    }

    const body =
      updateNotificationSchema.parse(req.body);

    const notification =
      await notificationService.updateNotification(
        id,
        body,
      );

    return res.status(200).json({
      success: true,
      message: "Notification updated successfully.",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required.",
      });
    }

    await notificationService.deleteNotification(id);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};