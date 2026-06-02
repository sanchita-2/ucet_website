import { db } from "../../../db/index.js";
import {
  users,
  students,
  emailVerificationTokens,
} from "../../../db/schema.js";

import { eq, or } from "drizzle-orm";

import { hashValue } from "../utils/hash.util.js";
import { hashToken } from "../utils/hash.util.js";
import { generateOtp } from "../utils/otp.utils.js";

import type { RegisterStudentInput } from "../validators/auth.validator.js";

// import { sendVerificationOtp } from "../services/mail.service.js";

export const registerStudent = async (
  data: RegisterStudentInput
): Promise<{
  userId: string;
  email: string;
}> => {
  const existingUser = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(
      or(
        eq(users.email, data.email),
        eq(users.phone, data.phone)
      )
    );

  if (existingUser.length > 0) {
    throw new Error(
      "Email or phone already registered"
    );
  }

  const existingStudent = await db
    .select({
      userId: students.userId,
    })
    .from(students)
    .where(eq(students.regNo, data.regNo));

  if (existingStudent.length > 0) {
    throw new Error(
      "Registration number already exists"
    );
  }

  const passwordHash = await hashValue(
    data.password
  );

  const otp = generateOtp();

  const otpHash = hashToken(otp);

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  const result = await db.transaction(
    async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          passwordHash,
          role: "student",
        })
        .returning();

         if (!user) {
      throw new Error("Failed to create user");
    }

      await tx.insert(students).values({
        userId: user.id,
        regNo: data.regNo,
        branchId: data.branchId,
      });

      await tx
        .delete(emailVerificationTokens)
        .where(
          eq(
            emailVerificationTokens.userId,
            user.id
          )
        );

      await tx
        .insert(emailVerificationTokens)
        .values({
          userId: user.id,
          tokenHash: otpHash,
          expiresAt,
        });

      return user;
    }
  );

  // Send OTP Email

  console.log(
    `OTP for ${result.email}: ${otp}`
  );

  return {
    userId: result.id,
    email: result.email,
  };
};