import type { Request, Response, NextFunction } from "express";
import { resendOtp } from "../services/otp.service.js";

export const resendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const result = await resendOtp(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
