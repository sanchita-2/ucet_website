import { teachers } from "../../db/schema.js";

export type Teacher =
  typeof teachers.$inferSelect;

export type NewTeacher =
  typeof teachers.$inferInsert;