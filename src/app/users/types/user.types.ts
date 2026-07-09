import type {
  users,
} from "../../../db/schema.js";

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;

export interface UserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender:
    | "male"
    | "female"
    | "other"
    | "prefer_not_to_say";
  role:
    | "admin"
    | "teacher"
    | "student"
    | "non_teaching_staff";
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
}