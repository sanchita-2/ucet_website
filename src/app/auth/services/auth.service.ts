import { db } from "../../../db/index.js";
import {
  users,
  students,
  branches,
  semesters,
  academicDetails,
  emailVerificationTokens,
  passwordResetTokens,
} from "../../../db/schema.js";

import { eq, or } from "drizzle-orm";

import { hashValue } from "../utils/hash.util.js";
import { hashToken } from "../utils/hash.util.js";
import { generateOtp } from "../utils/otp.utils.js";
import { sendOtpEmail } from "../services/mail.service.js";

import type { RegisterStudentInput } from "../validators/auth.validator.js";

export const registerStudent = async (
  data: RegisterStudentInput,
): Promise<{
  userId: string;
  email: string;
}> => {
  // Check if email or phone already exists
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.email, data.email), eq(users.phone, data.phone)));

  if (existingUser) {
    throw new Error("Email or phone already registered");
  }

  // Check if registration number already exists
  const [existingStudent] = await db
    .select({ userId: students.userId })
    .from(students)
    .where(eq(students.regNo, data.regNo));

  if (existingStudent) {
    throw new Error("Registration number already exists");
  }

  // Check if roll number already exists
  const [existingAcademic] = await db
    .select({ userId: academicDetails.userId })
    .from(academicDetails)
    .where(eq(academicDetails.rollNo, data.rollNo));

  if (existingAcademic) {
    throw new Error("Roll number already exists");
  }

  const passwordHash = await hashValue(data.password);

  const otp = generateOtp();
  const otpHash = hashToken(otp);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await db.transaction(async (tx) => {
    // Find branch
    const [branch] = await tx
      .select({
        id: branches.id,
      })
      .from(branches)
      .where(eq(branches.branchCode, data.branchCode));

    if (!branch) {
      throw new Error("Invalid branch code");
    }

    // Validate admission type
    if (data.admissionType === "regular" && data.entrySemesterNumber !== 1) {
      throw new Error("Regular admission must start from Semester 1");
    }

    if (
      data.admissionType === "lateral_entry" &&
      data.entrySemesterNumber !== 3
    ) {
      throw new Error("Lateral entry must start from Semester 3");
    }

    // Find semester
    const [semester] = await tx
      .select({
        id: semesters.id,
      })
      .from(semesters)
      .where(eq(semesters.semesterNumber, data.entrySemesterNumber));

    if (!semester) {
      throw new Error("Invalid entry semester");
    }

    // Create user
    const [newUser] = await tx
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

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    // Create student
    await tx.insert(students).values({
      userId: newUser.id,
      regNo: data.regNo,
      branchId: branch.id,
      currentSemesterId: semester.id,
    });

    // Create academic details
    await tx.insert(academicDetails).values({
      userId: newUser.id,
      rollNo: data.rollNo,
      dateOfAdmission: data.dateOfAdmission,
      admissionType: data.admissionType,
      entrySemesterId: semester.id,
    });

    // Remove old OTPs (if any)
    await tx
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, newUser.id));

    // Save new OTP
    await tx.insert(emailVerificationTokens).values({
      userId: newUser.id,
      tokenHash: otpHash,
      expiresAt,
    });

    return newUser;
  });

  // Send verification email
  await sendOtpEmail(user.email, otp);

  return {
    userId: user.id,
    email: user.email,
  };
};

// import { db } from "../../../db/index.js";
import { refreshTokens } from "../../../db/schema.js";

// import { eq } from "drizzle-orm";

import type { LoginInput } from "../validators/auth.validator.js";

import { compareValue } from "../utils/hash.util.js";

import { generateAccessToken } from "../utils/token.util.js";

import { generateRefreshToken } from "../utils/token.util.js";

export const loginUser = async (data: LoginInput) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account disabled");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email");
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error("Account temporarily locked");
  }

  // console.log("User found:", user?.email);
  // console.log("Input password:", password);
  // console.log("Stored hash:", user?.passwordHash);
  const isPasswordValid = await compareValue(data.password, user.passwordHash);

  if (!isPasswordValid) {
    await db
      .update(users)
      .set({
        failedLoginAttempts: user.failedLoginAttempts + 1,
      })
      .where(eq(users.id, user.id));

    throw new Error("Invalid credentials");
  }

  await db
    .update(users)
    .set({
      failedLoginAttempts: 0,
      lastLoginAt: new Date(),
    })
    .where(eq(users.id, user.id));

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  const refreshToken = generateRefreshToken();

  const refreshTokenHash = hashToken(refreshToken);

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
};

export const logoutUser = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);

  await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));

  return {
    message: "Logged out successfully",
  };
};

export const forgotPassword = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();

  const otpHash = hashToken(otp);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.transaction(async (tx) => {
    await tx
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));

    await tx.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash: otpHash,
      expiresAt,
    });
  });

  await sendOtpEmail(email, otp);
  // console.log("forgot-otp", otp);

  return {
    message: "Password reset OTP sent successfully",
  };
};

export const verifyResetOtp = async (email: string, otp: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new Error("User not found");
  }

  const [record] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, user.id));

  if (!record) {
    throw new Error("OTP not found");
  }

  if (record.used) {
    throw new Error("OTP already used");
  }

  if (new Date() > record.expiresAt) {
    throw new Error("OTP expired");
  }

  if (hashToken(otp) !== record.tokenHash) {
    throw new Error("Invalid OTP");
  }

  await db
    .update(passwordResetTokens)
    .set({
      used: true,
    })
    .where(eq(passwordResetTokens.userId, user.id));

  return {
    message: "OTP verified successfully",
  };
};

export const resetPassword = async (email: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new Error("User not found");
  }

  const passwordHash = await hashValue(password);

  await db
    .update(users)
    .set({
      passwordHash,
      passwordChangedAt: new Date(),
      passwordVersion: user.passwordVersion + 1,
    })
    .where(eq(users.id, user.id));

  return {
    message: "Password reset successful",
  };
};

// bskucwhOE3AUHPe
