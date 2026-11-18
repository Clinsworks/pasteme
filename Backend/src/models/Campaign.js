import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

const campaignSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    category: {
      type: String,
      required: true,
      enum: ["Education", "Medical", "Community", "Personal", "Business", "Other"],
    },
    story: { type: String, required: true, trim: true, maxlength: 1500 },
    target: { type: Number, required: true, min: 1, max: Number.MAX_SAFE_INTEGER },
    currency: { type: String, required: true },
    assetScale: { type: Number, required: true, min: 0, max: 9 },
    deadline: { type: Date, default: null },
    openEnded: { type: Boolean, default: false },
    coverImage: { type: String, default: "" },
    walletAddress: { type: String, default: "", select: false },
    status: { type: String, enum: ["published", "archived"], default: "published", index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

campaignSchema.index({ creatorId: 1, status: 1, publishedAt: -1 });

export const Campaign = mongoose.model("Campaign", campaignSchema);
