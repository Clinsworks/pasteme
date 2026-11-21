import assert from "node:assert/strict";
import express from "express";
import test from "node:test";
import { Campaign } from "../src/models/Campaign.js";
import { Donation } from "../src/models/Donation.js";
import communityRoutes from "../src/routes/communityRoutes.js";
import { errorHandler } from "../src/middleware/errors.js";

test("community impact returns confirmed totals and active campaign counts", async () => {
  const originalCampaignCount = Campaign.countDocuments;
  const originalDonationCount = Donation.countDocuments;
  const originalDonationAggregate = Donation.aggregate;
  let activeFilter;
  Campaign.countDocuments = async (filter) => {
    activeFilter = filter;
    return 4;
  };
  Donation.countDocuments = async (filter) => {
    assert.deepEqual(filter, {});
    return 7;
  };
  Donation.aggregate = async (pipeline) => {
    assert.deepEqual(pipeline[0].$group._id.assetScale, { $ifNull: ["$assetScale", 2] });
    return [
      { _id: { currency: "EUR", assetScale: 2 }, amount: 80 },
      { _id: { currency: "NGN", assetScale: 0 }, amount: 15 },
    ];
  };

  const app = express();
  app.use("/api/community", communityRoutes);
  app.use(errorHandler);
  const server = app.listen(0, "127.0.0.1");

  try {
    await new Promise((resolve) => server.once("listening", resolve));
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/community/impact`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      totalsByCurrency: [
        { amount: 80, currency: "EUR", assetScale: 2 },
        { amount: 15, currency: "NGN", assetScale: 0 },
      ],
      studentsHelped: null,
      activePastes: 4,
      contributors: 7,
    });
    assert.equal(activeFilter.status, "published");
    assert.equal(activeFilter.$or.some((condition) => condition.deadline?.$gte instanceof Date), true);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
    Campaign.countDocuments = originalCampaignCount;
    Donation.countDocuments = originalDonationCount;
    Donation.aggregate = originalDonationAggregate;
  }
});
