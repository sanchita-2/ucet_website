import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { registerStudent } from "../services/auth.service.js";

import type {
  RegisterStudentInput,
} from "../validators/auth.validator.js";

import {
  registerStudentSchema,
} from "../validators/auth.validator.js";


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
      const validatedData =
        registerStudentSchema.parse(
          req.body
        );

      const result =
        await registerStudent(
          validatedData
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