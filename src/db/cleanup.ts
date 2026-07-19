import { db } from "./index.js";
import { refreshTokens } from "./schema.js";
import { lt, eq, or } from "drizzle-orm";

export async function cleanupRefreshTokens() {
  const deleted = await db
    .delete(refreshTokens)
    .where(
      or(
        lt(refreshTokens.expiresAt, new Date()),
        eq(refreshTokens.revoked, true),
      ),
    )
    .returning({ id: refreshTokens.id });

  console.info(`🧹 Cleaned ${deleted.length} refresh token(s)`);
}
