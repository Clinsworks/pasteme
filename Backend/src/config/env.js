import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required."),
  AUTH_TOKEN_SECRET: z.string().min(32, "AUTH_TOKEN_SECRET must be at least 32 characters."),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  API_PUBLIC_URL: z.string().url().default("http://localhost:5000"),
  PAYMENT_DATA_ENCRYPTION_KEY: z.string().optional(),
  OPEN_PAYMENTS_CLIENT_WALLET_ADDRESS: z.string().optional(),
  OPEN_PAYMENTS_PRIVATE_KEY_PATH: z.string().optional(),
  OPEN_PAYMENTS_KEY_ID: z.string().optional(),
});

export const env = schema.parse(process.env);
