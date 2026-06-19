import { db } from "../../../db/index.js";
import {
  users,
  emailVerificationTokens,
} from "../../../db/schema.js";

import { eq } from "drizzle-orm";
import { hashToken} from "../utils/hash.util.js";
import { generateOtp } from "../utils/otp.utils.js";
import { sendOtpEmail } from "./mail.service.js";

// const lastSent = new Map<string, number>();
export const resendOtp = async (email: string) => {
  //  // ✅ 1. COOLDOWN CHECK (PLACE HERE)
  // const lastTime = lastSent.get(email) ?? 0;

  // if (Date.now() - lastTime < 60000) {
  //   throw new Error("Wait 60 seconds before resending OTP");
  // }

  // // update timestamp immediately to prevent spam clicks
  // lastSent.set(email, Date.now());

  // 2. fetch user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) throw new Error("User not found");

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  const otp = generateOtp();
  const otpHash = hashToken(otp);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.transaction(async (tx) => {
    await tx
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, user.id));

    await tx.insert(emailVerificationTokens).values({
      userId: user.id,
      tokenHash: otpHash,
      expiresAt,
    });
  });

  await sendOtpEmail(user.email, otp);
  console.log("otp",otp);

  return {
    message: "OTP sent successfully",
  };
};

export const verifyEmailOtp = async (email: string, otp: string) => {
  console.log("Searching user with email:", email);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) throw new Error("User not found");

  console.log("User found:", user);
  const [record] = await db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.userId, user.id))
    .limit(1);

  if (!record) throw new Error("OTP not found");

  if (record.used) throw new Error("OTP already used");

  if (new Date() > record.expiresAt) {
    throw new Error("OTP expired");
  }

  if (hashToken(otp) !== record.tokenHash) {
    throw new Error("Invalid OTP");
  }

  await db.transaction(async (tx) => {
    await tx.update(users).set({
      isVerified: true,
      emailVerifiedAt: new Date(),
    }).where(eq(users.id, user.id));

    await tx.update(emailVerificationTokens).set({
      used: true,
    }).where(eq(emailVerificationTokens.userId, user.id));
  });

  return { message: "Email verified successfully" };
};