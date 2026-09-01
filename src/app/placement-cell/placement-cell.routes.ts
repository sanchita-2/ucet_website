
import { Router } from "express";
import { placementCellController } from "./placement-cell.controller.js";
import { validate } from "../auth/middlewares/validate.js";
import { authenticate } from "../auth/middleware/authenticate.js";
import { authorizeRole } from "../auth/middleware/authorize-role.js";
import { USER_ROLES } from "../../shared/constants/user-role.js";
import {
  createPlacementCellSchema,
  updatePlacementCellSchema,
} from "./placement-cell.validation.js";

const router = Router();

// Authenticated Read Routes
router.get("/", authenticate, placementCellController.getAll);
router.get("/:id", authenticate, placementCellController.getById);

// Admin Only Mutating Routes
router.post(
  "/",
  authenticate,
  authorizeRole(USER_ROLES.ADMIN),
  validate(createPlacementCellSchema),
  placementCellController.create,
);

router.patch(
  "/:id",
  authenticate,
  authorizeRole(USER_ROLES.ADMIN),
  validate(updatePlacementCellSchema),
  placementCellController.update,
);

router.patch(
  "/:id/toggle-status",
  authenticate,
  authorizeRole(USER_ROLES.ADMIN),
  placementCellController.toggleStatus,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole(USER_ROLES.ADMIN),
  placementCellController.delete,
);

export default router;