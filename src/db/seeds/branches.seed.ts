import { db } from "../index.js";
import { branches } from "../schema.js";

export async function seedBranches() {
  console.log("🌱 Seeding branches...");

  await db
    .insert(branches)
    .values([
      {
        code: "CSE",
        branchName: "Computer Science & Engineering",
      },
      {
        code: "IT",
        branchName: "Information Technology",
      },
      {
        code: "ECE",
        branchName: "Electronics & Communication Engineering",
      },
      {
        code: "ME",
        branchName: "Mechanical Engineering",
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Branches seeded successfully");
}
