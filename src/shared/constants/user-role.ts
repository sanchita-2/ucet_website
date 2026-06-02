export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  NON_TEACHING_STAFF: "non_teaching_staff",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
