import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { env } from "../config/env.js";
import * as schema from "./schema.js";
export * from "./relations.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, {
  schema,
});

export async function verifyDatabaseConnection() {
  try {
    await db.execute(sql`SELECT 1`);
    console.info("✅ Database Connected");
  } catch (error) {
    throw new Error("Database connection failed", {
      cause: error,
    });
  }
}

export async function closeDbConnection() {
  await pool.end();
}
