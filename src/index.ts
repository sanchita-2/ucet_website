import http from "node:http";
import { createExpressApplication } from "./app/index.js";
import { env } from "./config/env.js";
import { verifyDatabaseConnection, closeDbConnection } from "./db/index.js";

async function main() {
  try {
    await verifyDatabaseConnection();

    const app = createExpressApplication();
    const server = http.createServer(app);

    server.listen(env.PORT, () => {
      console.log(`HTTP server is running on PORT ${env.PORT}`);
    });

    const gracefulShutdown = async () => {
      console.log("⚠️ Shutting down gracefully...");

      try {
        await closeDbConnection();
      } catch (error) {
        console.error("Error closing database connection", error);
      }

      server.close(() => {
        console.log("🛑 Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("❌ Application startup failed");
    console.error(error);
    process.exit(1);
  }
}

main();
