import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  authorizePayment,
  createPaymentQuote,
  handlePaymentAuthorization,
  paymentStatus,
} from "../controllers/paymentController.js";

const router = Router();
const paymentIdSchema = z.object({ paymentIntentId: z.string().uuid() });
const validatePaymentId = validate(paymentIdSchema, "params");
const quoteSchema = z.object({
  campaignId: z.string().uuid(),
  senderWalletAddress: z.string().url(),
  amount: z.coerce.number().finite().int().positive().max(1_000_000_000),
});

router.post("/quote", validate(quoteSchema), asyncHandler(createPaymentQuote));
router.post("/:paymentIntentId/authorize", validatePaymentId, asyncHandler(authorizePayment));
router.get("/:paymentIntentId/status", validatePaymentId, asyncHandler(paymentStatus));
router.get("/:paymentIntentId/callback", validatePaymentId, asyncHandler(handlePaymentAuthorization));

export default router;
