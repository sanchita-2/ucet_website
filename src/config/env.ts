import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),

  DATABASE_URL: z.string().min(1),

  NODE_ENV: z.enum(["development", "production"]).default("development"),

  JWT_SECRET: z.string().min(1),

  JWT_ACCESS_EXPIRES_IN_SECONDS: z.coerce.number(),

  JWT_REFRESH_SECRET: z.string().min(1),

  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number(),

  PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: z.coerce.number(),

  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_HOURS: z.coerce.number(),

  SMTP_HOST: z.string().min(1),

  SMTP_PORT: z.coerce.number(),

  SMTP_USER: z.string().min(1),

  SMTP_PASS: z.string().min(1),

  SMTP_FROM: z.string().min(1),
});

export const env = envSchema.parse(process.env);
