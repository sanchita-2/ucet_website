import { db } from "../index.js";
import { branches } from "../schema.js";

export async function seedBranches() {
  console.log("🌱 Seeding branches...");

  await db
    .insert(branches)
    .values([
      {
        branchCode: "CSE",
        branchName: "Computer Science & Engineering",
      },
      {
        branchCode: "IT",
        branchName: "Information Technology",
      },
      {
        branchCode: "ECE",
        branchName: "Electronics & Communication Engineering",
      },
      {
        branchCode: "ME",
        branchName: "Mechanical Engineering",
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Branches seeded successfully");
}
