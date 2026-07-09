import { desc, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { notifications } from "../../db/schema.js";

import type {
  CreateNotificationInput,
  UpdateNotificationInput,
} from "./notification.validator.js";

/**
 * Create Notification
 */
export const createNotification = async (
  data: CreateNotificationInput,
) => {
  const [notification] = await db
    .insert(notifications)
    .values({
      title: data.title,
      content: data.content,
      category: data.category,
    })
    .returning();

  return notification;
};

/**
 * Get All Notifications
 */
export const getAllNotifications = async () => {
  return await db
    .select()
    .from(notifications)
    .orderBy(desc(notifications.createdAt));
};

/**
 * Get Notification By Id
 */
export const getNotificationById = async (
  id: string,
) => {
  const [notification] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id));

  if (!notification) {
    throw new Error("Notification not found.");
  }

  return notification;
};

/**
 * Update Notification
 */
export const updateNotification = async (
  id: string,
  data: UpdateNotificationInput,
) => {
  const [notification] = await db
    .update(notifications)
    .set({
      ...(data.title && {
        title: data.title,
      }),

      ...(data.content && {
        content: data.content,
      }),

      ...(data.category && {
        category: data.category,
      }),

      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();

  if (!notification) {
    throw new Error("Notification not found.");
  }

  return notification;
};

/**
 * Delete Notification
 */
export const deleteNotification = async (
  id: string,
) => {
  const [notification] = await db
    .delete(notifications)
    .where(eq(notifications.id, id))
    .returning();

  if (!notification) {
    throw new Error("Notification not found.");
  }

  return notification;
};