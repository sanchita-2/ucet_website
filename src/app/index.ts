import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Express } from "express";
import { errorHandler } from "./middlewares/error-handler.js";
import authRoutes from "./auth/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import notificationRouter from "./routes/notification.route.js";



export function createExpressApplication(): Express {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Routes
  app.get("/", (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Backend server is running",
    });
  });

  app.get("/health", (req, res) => {
    return res.status(200).json({
      status: "healthy",
    });
  });

  app.use("/api/notifications", notificationRouter);
 
 
 
  // Error Handler
  app.use(errorHandler);


  app.use("/api/auth", authRoutes);

  return app;
}
