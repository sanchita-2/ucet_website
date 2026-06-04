import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  verifyAccessToken,
  type AccessTokenPayload,
} from "../utils/token.util.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });

      return;
    }

    if (
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      res.status(401).json({
        success: false,
        message:
          "Invalid authorization header",
      });

      return;
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message:
          "Access token missing",
      });

      return;
    }

    const decoded =
      verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message:
        "Invalid or expired access token",
    });
  }
};