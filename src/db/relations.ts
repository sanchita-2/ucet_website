import { students, users, branches } from "./schema.js";
import { relations } from "drizzle-orm";

export const studentsRelations = relations(students, ({ one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),

  branch: one(branches, {
    fields: [students.branchId],
    references: [branches.id],
  }),
}));
