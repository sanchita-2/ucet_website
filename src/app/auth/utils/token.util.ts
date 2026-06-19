import jwt from "jsonwebtoken";
import type { UserRole } from "../../../shared/constants/user-role.js";
import crypto from "crypto";

import { db } from "../../../db/index.js";
import {
  users
} from "../../../db/schema.js";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;   // ✅ use centralized type
  email: string;
}

export const generateAccessToken = (
  payload: AccessTokenPayload
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (
  token: string
): AccessTokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
  } catch {
    throw new Error("Invalid or expired access token");
  }
};



export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

// const accessToken = jwt.sign(
//   {
//     sub: users.id,
//     role: users.role,
//   },
//   process.env.JWT_ACCESS_SECRET!,
//   {
//     expiresIn: "15m",
//   }
// );

// const refreshToken = jwt.sign(
//   {
//     sub: users.id,
//   },
//   process.env.JWT_REFRESH_SECRET!,
//   {
//     expiresIn: "7d",
//   }
// );