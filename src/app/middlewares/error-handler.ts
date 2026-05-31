import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  return res.status(500).json({
    success: false,
    message: err.message,
  });
}
