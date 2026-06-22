import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { registerStudent,forgotPassword,verifyResetOtp,resetPassword } from "../services/auth.service.js";
import { logoutUser } from "../services/auth.service.js";

import type {
  RegisterStudentInput,
} from "../validators/auth.validator.js";

import {
  loginSchema,
  type LoginInput,
} from "../validators/auth.validator.js";

import {
  loginUser,
} from "../services/auth.service.js";

import {
  registerStudentSchema,
} from "../validators/auth.validator.js";

import {
  generateAccessToken,
} from "../utils/token.util.js";

import {
  generateRefreshToken,
} from "../utils/token.util.js";

export const registerStudentController =
  async (
    req: Request<
      {},
      {},
      RegisterStudentInput
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // const validatedData =
      //   registerStudentSchema.parse(
      //     req.body
      //   );

      const result =
        await registerStudent(
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          "Registration successful. OTP sent to your email address.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

export const loginController =
  async (
    req: Request<
      {},
      {},
      LoginInput
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const validatedData =
      //   loginSchema.parse(req.body);

      // const result =
      //   await loginUser(
      //     validatedData
      //   );
      const result =
  await loginUser(req.body);

  res.cookie(
  "accessToken",
  result.accessToken,
  {
    httpOnly: true,
    secure: false, // true in production HTTPS
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  }
);

res.cookie(
  "refreshToken",
  result.refreshToken,
  {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
);

      res.status(200).json({
        success: true,
        message:
          "Login successful",
      });
    } catch (error) {
      next(error);
    }
  };



export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message:
          "Refresh token missing",
      });
    }

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      const result =
        await forgotPassword(email);
        console.log()

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  export const verifyResetOtpController =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, otp } =
        req.body;

      const result =
        await verifyResetOtp(
          email,
          otp
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
};

export const resetPasswordController =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } =
        req.body;

      const result =
        await resetPassword(
          email,
          password
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };