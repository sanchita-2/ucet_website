import { Router } from "express";

import { validate } from "../middlewares/validate.js";

import {
  registerStudentSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";

import {
  registerStudentController,
  loginController,
  forgotPasswordController,
  verifyResetOtpController,
  resetPasswordController,
  logoutController,
} from "../controllers/auth.controller.js";

import { verifyEmailController } from "../controllers/VerifyEmail.controller.js";

import { resendOtpController } from "../controllers/resendotp.controller.js";

const router: Router = Router();

router.post(
  "/register",
  validate(registerStudentSchema),
  registerStudentController,
);

router.post("/login", validate(loginSchema), loginController);

// router.post(
//   "/verify-email",
//   verifyEmailController
// );

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  verifyEmailController,
);

router.post("/resend-otp", resendOtpController);

router.post("/logout", logoutController);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController,
);

router.post(
  "/verify-reset-otp",
  validate(verifyResetOtpSchema),
  verifyResetOtpController,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController,
);

export default router;
