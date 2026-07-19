import { students } from "../../db/schema.js";

export type Student = typeof students.$inferSelect;

export type NewStudent = typeof students.$inferInsert;