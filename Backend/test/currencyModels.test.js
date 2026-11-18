import test from "node:test";
import mongoose from "mongoose";
import { Campaign } from "../src/models/Campaign.js";
import { Donation } from "../src/models/Donation.js";
import { PaymentIntent } from "../src/models/PaymentIntent.js";

test("campaigns, payment intents, and donations accept non-NGN wallet currencies", async () => {
  const creatorId = new mongoose.Types.ObjectId();
  const campaign = new Campaign({
    creatorId,
    title: "Community project",
    category: "Community",
    story: "A community fundraising campaign.",
    target: 500,
    currency: "USD",
    assetScale: 2,
  });
  const paymentIntent = new PaymentIntent({
    campaignId: campaign.id,
    amount: 25,
    currency: "USD",
    quote: {},
    protectedData: "encrypted",
    expiresAt: new Date(Date.now() + 60_000),
  });
  const donation = new Donation({
    campaignId: campaign.id,
    paymentIntentId: paymentIntent.id,
    amount: 25,
    currency: "USD",
  });

  await Promise.all([
    campaign.validate(),
    paymentIntent.validate(),
    donation.validate(),
  ]);
});
