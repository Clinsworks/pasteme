import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import {
  currentUser,
  login,
  loginSchema,
  logout,
  requestPasswordRecovery,
  signup,
  signupSchema,
} from "../controllers/authController.js";

const router = Router();

router.post("/signup", validate(signupSchema), asyncHandler(signup));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/me", authenticate, asyncHandler(currentUser));
router.post(
  "/forgot-password",
  validate(z.object({ email: z.string().trim().email() })),
  asyncHandler(requestPasswordRecovery)
);

export default router;
