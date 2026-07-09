import { Router } from "express";

import {
  getMyProfileController,
  getUserByIdController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
} from ".././controllers/user.controller.js";

import { authenticate } from "../../auth/middleware/authenticate.js";

import { authorizeRole } from "../../auth/middleware/authorize-role.js";

const userRouter = Router();


userRouter.get(
  "/me",
  authenticate,
  getMyProfileController,
);

/**
 * Get all users
 * Admin only
 */
userRouter.get(
  "/",
  authenticate,
  authorizeRole("admin"),
  getAllUsersController,
);

/*
  Get user by id
  Admin only
 */
userRouter.get(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  getUserByIdController,
);

/*
  Update user
 
  Admin only
  (Later we can allow users to update their own profile)
 */
userRouter.patch(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  updateUserController,
);

/*
 Activate / Deactivate user
  Admin only
 */
userRouter.patch(
  "/:id/status",
  authenticate,
  authorizeRole("admin"),
  
);

/**
  Soft delete user
 Admin only
 */
userRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteUserController,
);

export default userRouter;