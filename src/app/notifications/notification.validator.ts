import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(255, "Title cannot exceed 255 characters."),

  content: z
    .string()
    .trim()
    .min(5, "Content must be at least 5 characters.")
    .max(5000, "Content cannot exceed 5000 characters."),

  category: z.enum([
    "general",
    "academic",
    "exam",
    "placement",
    "event",
    "holiday",
  ]),

  priority: z
    .enum([
      "normal",
      "high",
      "urgent",
    ])
    .optional(),

  isPinned: z
    .boolean()
    .optional(),

  expiresAt: z
    .string()
    .datetime()
    .optional(),
});

export const updateNotificationSchema =
  createNotificationSchema.partial();

export type CreateNotificationInput =
  z.infer<typeof createNotificationSchema>;

export type UpdateNotificationInput =
  z.infer<typeof updateNotificationSchema>;