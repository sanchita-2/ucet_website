import "dotenv/config";

console.log("JWT_SECRET =", process.env.JWT_SECRET);
console.log("JWT_REFRESH_SECRET =", process.env.JWT_REFRESH_SECRET);
import http from "node:http";
import { createExpressApplication } from "./app/index.js";
import { env } from "./config/env.js";
import {testDbConnection} from "./db/index.js"
async function main() {
  try {
     await testDbConnection();
    const server = http.createServer(createExpressApplication());
    const PORT = Number(env.PORT) || 3000;

    server.listen(PORT, () => {
      console.log(`HTTP server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting http server");
    throw error;
  }
}

main();
