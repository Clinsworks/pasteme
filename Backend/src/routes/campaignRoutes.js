import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/authenticate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  campaignSchema,
  createCampaign,
  deleteCampaign,
  getOwnerCampaign,
  getPublicCampaign,
  inspectCampaignWallet,
  listCampaigns,
  updateCampaign,
} from "../controllers/campaignController.js";

const router = Router();
const campaignIdSchema = z.object({ campaignId: z.string().uuid() });
const validateCampaignId = validate(campaignIdSchema, "params");
const validCampaign = validate(campaignSchema(z));
const walletSchema = z.object({ walletAddress: z.string().url() });

router.get("/", authenticate, asyncHandler(listCampaigns));
router.post("/wallet-asset", authenticate, validate(walletSchema), asyncHandler(inspectCampaignWallet));
router.post("/", authenticate, validCampaign, asyncHandler(createCampaign));
router.get("/:campaignId/owner", authenticate, validateCampaignId, asyncHandler(getOwnerCampaign));
router.get("/:campaignId", validateCampaignId, asyncHandler(getPublicCampaign));
router.patch("/:campaignId", authenticate, validateCampaignId, validCampaign, asyncHandler(updateCampaign));
router.delete("/:campaignId", authenticate, validateCampaignId, asyncHandler(deleteCampaign));

export default router;
