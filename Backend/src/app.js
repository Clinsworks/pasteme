import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import discoveryRoutes from "./routes/discoveryRoutes.js";
import { connectDatabase } from "./config/database.js";
import { errorHandler, HttpError } from "./middleware/errors.js";

const app = express();
const allowedOrigin = new URL(env.FRONTEND_URL).origin;

app.disable("x-powered-by");
app.set("trust proxy", env.NODE_ENV === "production" ? 1 : false);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === allowedOrigin) return callback(null, true);
    return callback(new HttpError(403, "This origin is not allowed."));
  },
  credentials: true,
}));
app.use((request, _response, next) => {
  const origin = request.get("origin");
  if (origin && origin !== allowedOrigin) return next(new HttpError(403, "This origin is not allowed."));
  next();
});
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(async (_request, _response, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/discovery", discoveryRoutes);
app.use("/api/payments", paymentLimiter, paymentRoutes);
app.use((_request, _response, next) => next(new HttpError(404, "Endpoint not found.")));
app.use(errorHandler);

export default app;
