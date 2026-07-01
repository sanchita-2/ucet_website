import { and, desc, eq, gt, isNull, or } from "drizzle-orm";

import { db } from "../../db/index.js";
import { notifications } from "../../db/schema.js";

import type {
  CreateNotificationInput,
  UpdateNotificationInput,
} from "./notification.validator.js";

export const createNotification = async (
  data: CreateNotificationInput,
  createdBy: string,
) => {
  const [notification] = await db
    .insert(notifications)
    .values({
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority ?? "normal",
      isPinned: data.isPinned ?? false,
      expiresAt: data.expiresAt
        ? new Date(data.expiresAt)
        : null,
      createdBy,
    })
    .returning();

  return notification;
};

export const getAllNotifications = async () => {
  return db
    .select()
    .from(notifications)
    .where(
      or(
        isNull(notifications.expiresAt),
        gt(notifications.expiresAt, new Date()),
      ),
    )
    .orderBy(
      desc(notifications.isPinned),
      desc(notifications.createdAt),
    );
};

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

      ...(data.priority && {
        priority: data.priority,
      }),

      ...(typeof data.isPinned === "boolean" && {
        isPinned: data.isPinned,
      }),

      ...(data.expiresAt !== undefined && {
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt)
          : null,
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