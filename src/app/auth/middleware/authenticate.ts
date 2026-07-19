
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  verifyAccessToken,
  type AccessTokenPayload,
} from "../utils/token.util.js";

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
  // console.log("Headers:", req.headers);
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

    const token = authHeader.split(" ")[1];

    //  console.log("Received Token:", token);

    if (!token) {
      res.status(401).json({
        success: false,
        message:
          "Access token missing",
      });

      return;
    }


    const decoded = verifyAccessToken(token);

    req.user = decoded;

    //  console.log("Decoded User:", decoded);

next();
  } catch {
    res.status(401).json({
      success: false,
      message:
        "Invalid or expired access token",
    });
  }
};