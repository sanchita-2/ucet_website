
import { authenticate } from "../auth/middleware/authenticate.js";
import { authorizeRole } from "../auth/middleware/authorize-role.js";

import { Router, type Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();



router.get(
  "/me",
  authenticate,
  (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);


router.get(
  "/admin",
  authenticate,
  authorizeRole("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

export default router;