import { Router } from "express";
import { z } from "zod";
import { listDiscoverablePastes } from "../controllers/discoveryController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();
const pageSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

function validatePage(request, _response, next) {
  try {
    request.discoveryPage = pageSchema.parse(request.query).page;
    next();
  } catch (error) {
    next(error);
  }
}

router.get("/pastes", validatePage, asyncHandler(listDiscoverablePastes));

export default router;
