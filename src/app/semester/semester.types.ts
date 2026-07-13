import { semesters } from "../../db/schema.js";

export type Semester = typeof semesters.$inferSelect;

export type NewSemester = typeof semesters.$inferInsert;