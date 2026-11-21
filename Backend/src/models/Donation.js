import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    campaignId: { type: String, required: true, index: true },
    paymentIntentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true },
    assetScale: { type: Number, required: true, min: 0, max: 9, default: 2 },
  },
  { timestamps: true, versionKey: false }
);

export const Donation = mongoose.model("Donation", donationSchema);
