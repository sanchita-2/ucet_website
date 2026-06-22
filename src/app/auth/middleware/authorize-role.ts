import type {
  Request,
  Response,
  NextFunction,
} from "express";

type UserRole =
  | "student"
  | "teacher"
  | "admin"
  | "non_teaching_staff";

export const authorizeRole =
  (...allowedRoles: UserRole[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });

      return;
    }

    const userRole =
      req.user.role;

    if (
      !allowedRoles.includes(
        userRole
      )
    ) {
      res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource",
      });

      return;
    }

    next();
  };