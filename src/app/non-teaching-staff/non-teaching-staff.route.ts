import { Router } from "express";
import { authenticate } from "../auth/middleware/authenticate.js"; // Adjust path
import { authorizeRole } from "../auth/middleware/authorize-role.js"; // Adjust path
import { validate } from "../auth/middlewares/validate.js"; // Adjust path
import * as controller from "./non-teaching-staff.controller.js";
import { createStaffSchema, updateStaffSchema } from "./non-teaching-staff.validator.js";

const router = Router();

// Apply global admin protection for all routes in this file
router.use(authenticate);
router.use(authorizeRole("admin"));

router.post("/", validate(createStaffSchema), controller.createStaff);
router.get("/", controller.getStaffList);
router.get("/:id", controller.getStaffDetail);
router.patch("/:id", validate(updateStaffSchema), controller.updateStaff);
router.delete("/:id", controller.deleteStaff);

export default router;