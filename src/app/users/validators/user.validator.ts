import { z } from "zod";

export const userIdSchema = z.object({
  id: z.uuid("Invalid user id"),
});

export type UserIdInput = z.infer<
  typeof userIdSchema
>;

/* Update User*/
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(
      /^[A-Za-z\s]+$/,
      "First name can contain only letters"
    )
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(
      /^[A-Za-z\s]+$/,
      "Last name can contain only letters"
    )
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian mobile number"
    )
    .optional(),

  gender: z
    .enum([
      "male",
      "female",
      "other",
      "prefer_not_to_say",
    ])
    .optional(),
});

export type UpdateUserInput = z.infer<
  typeof updateUserSchema
>;

export const updateUserStatusSchema =
  z.object({
    isActive: z.boolean(),
  });

export type UpdateUserStatusInput =
  z.infer<
    typeof updateUserStatusSchema
  >;