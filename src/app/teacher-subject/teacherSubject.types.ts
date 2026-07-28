import { teacherSubjects } from "../../db/schema.js";

export type TeacherSubject =
typeof teacherSubjects.$inferSelect;

export type NewTeacherSubject =
typeof teacherSubjects.$inferInsert;