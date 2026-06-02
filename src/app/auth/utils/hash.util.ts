import bcrypt from "bcrypt";
import crypto from "crypto";
const SALT_ROUNDS: number = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

export const hashValue = async (
  value: string
): Promise<string> => {
  return await bcrypt.hash(value, SALT_ROUNDS);
};

export const compareValue = async (
  value: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(value, hash);
};

export const hashToken = (
  token: string
): string => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};