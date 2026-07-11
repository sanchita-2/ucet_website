
import type { Request, Response, NextFunction } from "express";
import {verifyEmailOtp} from "../services/otp.service.js"
export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // console.log("Verify Email Request:");
// console.log("Email:", email);
// console.log("OTP:", otp);

    const result = await verifyEmailOtp(email, otp);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};