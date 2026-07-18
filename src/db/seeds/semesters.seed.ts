import { db } from "../index.js";
import { semesters } from "../schema.js";

export async function seedSemesters() {
  console.log("🌱 Seeding semesters...");

  await db
    .insert(semesters)
    .values([
      { semesterNumber: 1, year: 1 },
      { semesterNumber: 2, year: 1 },
      { semesterNumber: 3, year: 2 },
      { semesterNumber: 4, year: 2 },
      { semesterNumber: 5, year: 3 },
      { semesterNumber: 6, year: 3 },
      { semesterNumber: 7, year: 4 },
      { semesterNumber: 8, year: 4 },
    ])
    .onConflictDoNothing();

  console.log("✅ Semesters seeded successfully");
}
