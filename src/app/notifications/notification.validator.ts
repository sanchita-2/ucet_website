import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(255, "Title cannot exceed 255 characters."),

  content: z
    .string()
    .min(5, "Content is required."),

  category: z.enum([
    "GENERAL",
    "ACADEMIC",
    "EVENT",
  ]),
});

export const updateNotificationSchema =
  createNotificationSchema.partial();

export type CreateNotificationInput =
  z.infer<typeof createNotificationSchema>;

export type UpdateNotificationInput =
  z.infer<typeof updateNotificationSchema>;