import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

const paymentIntentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    campaignId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["awaiting_authorization", "processing", "pending", "settled", "failed"],
      default: "awaiting_authorization",
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    assetScale: { type: Number, required: true, min: 0, max: 9, default: 2 },
    quote: { type: mongoose.Schema.Types.Mixed, required: true },
    protectedData: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    settledAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

export const PaymentIntent = mongoose.model("PaymentIntent", paymentIntentSchema);
