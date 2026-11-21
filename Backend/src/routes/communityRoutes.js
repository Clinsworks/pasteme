import { Router } from "express";
import { getCommunityImpact } from "../controllers/communityController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/impact", asyncHandler(getCommunityImpact));

export default router;
