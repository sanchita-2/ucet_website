import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getMyProfile,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../services/user.service.js";

import {
  userIdSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from "../validators/user.validator.js";

import type {
  UpdateUserInput,
  UpdateUserStatusInput,
} from "../validators/user.validator.js";

//get logged in users
export const getMyProfileController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await getMyProfile(
        req.user!.userId,
      );

      res.status(200).json({
        success: true,
        message: "Profile fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };


export const getUserByIdController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = userIdSchema.parse(
        req.params,
      );

      const result =
        await getUserById(id);

      res.status(200).json({
        success: true,
        message:
          "User fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

export const getAllUsersController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result =
        await getAllUsers();

      res.status(200).json({
        success: true,
        message:
          "Users fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };


export const updateUserController =
  async (
    req: Request<
      { id: string },
      {},
      UpdateUserInput
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = userIdSchema.parse(
        req.params,
      );

      const validatedData =
        updateUserSchema.parse(req.body);

      const result =
        await updateUser(
          id,
          validatedData,
        );

      res.status(200).json({
        success: true,
        message:
          "User updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

export const deleteUserController =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = userIdSchema.parse(
        req.params,
      );

      const result =
        await deleteUser(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };