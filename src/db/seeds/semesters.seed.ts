import { db } from "../index.js";
import { semesters } from "../schema.js";

export async function seedSemesters() {
  console.log("🌱 Seeding semesters...");

  await db
    .insert(semesters)
    .values([
      { semNumber: 1 },
      { semNumber: 2 },
      { semNumber: 3 },
      { semNumber: 4 },
      { semNumber: 5 },
      { semNumber: 6 },
      { semNumber: 7 },
      { semNumber: 8 },
    ])
    .onConflictDoNothing();

  console.log("✅ Semesters seeded successfully");
}
