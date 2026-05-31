import express from "express";
import type { Express } from "express";
import { errorHandler } from "./middlewares/error-handler.js";

export function createExpressApplication(): Express {
  const app = express();

  // Middlewares

  // Routes
  app.get("/", (req, res) => {
    return res.status(200).json({
      status: "healthy",
      message: "Server is running",
    });
  });

  // Error Handler
  app.use(errorHandler);

  return app;
}
