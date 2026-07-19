import { seedBranches } from "./branches.seed.js";
import { seedSemesters } from "./semesters.seed.js";

async function seed() {
  console.log("🌱 Starting database seeding...\n");

  await seedBranches();
  await seedSemesters();

  console.log("\n🎉 Database seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  });
