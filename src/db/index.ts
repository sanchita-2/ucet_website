import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
export const db = drizzle(process.env.DATABASE_URL!);

export async function testDbConnection() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error);
  }
}