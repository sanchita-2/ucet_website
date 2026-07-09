import { branches } from "../../db/schema.js";

export type Branch = typeof branches.$inferSelect;

export type NewBranch = typeof branches.$inferInsert;