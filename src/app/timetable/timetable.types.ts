import { timetables } from "../../db/schema.js";

export type Timetable =
typeof timetables.$inferSelect;

export type NewTimetable =
typeof timetables.$inferInsert;