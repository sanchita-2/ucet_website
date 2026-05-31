import http from "node:http";
import { createExpressApplication } from "./app/index.js";
import "dotenv/config";

async function main() {
  try {
    const server = http.createServer(createExpressApplication());
    const PORT = Number(process.env.PORT) || 3000;

    server.listen(PORT, () => {
      console.log(`HTTP server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting http server");
    throw error;
  }
}

main();
