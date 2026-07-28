import { subjects } from "../../db/schema.js";

export type Subject =
typeof subjects.$inferSelect;

export type NewSubject =
typeof subjects.$inferInsert;