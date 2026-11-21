import assert from "node:assert/strict";
import express from "express";
import test from "node:test";
import { Campaign } from "../src/models/Campaign.js";
import { Donation } from "../src/models/Donation.js";
import discoveryRoutes from "../src/routes/discoveryRoutes.js";
import { errorHandler } from "../src/middleware/errors.js";
import { DISCOVERY_PAGE_SIZE } from "../src/controllers/discoveryController.js";

test("discovery returns one public-safe page of five campaigns with confirmed totals", async () => {
  const campaignId = "d3b07384-d9a0-4a2d-a5a2-193efb847c36";
  const campaign = {
    _id: campaignId,
    title: "A community campaign",
    category: "Community",
    story: "A public story.",
    target: 100,
    currency: "NGN",
    assetScale: 2,
    deadline: null,
    openEnded: true,
    coverImage: "",
    status: "published",
    publishedAt: new Date("2026-01-01T00:00:00.000Z"),
    creatorId: { name: "Campaign creator", email: "private@example.test" },
    walletAddress: "https://private.example.test/wallet",
  };
  const pageCampaigns = [
    campaign,
    ...Array.from({ length: 4 }, (_, index) => ({
      ...campaign,
      _id: `campaign-${index + 2}`,
      title: `Campaign ${index + 2}`,
    })),
  ];
  const originalFind = Campaign.find;
  const originalCountDocuments = Campaign.countDocuments;
  const originalAggregate = Donation.aggregate;
  const calls = {};
  Campaign.find = (filter) => {
    calls.filter = filter;
    const query = {
      sort(value) { calls.sort = value; return this; },
      skip(value) { calls.skip = value; return this; },
      limit(value) { calls.limit = value; return this; },
      populate(value) { calls.populate = value; return this; },
      lean() { return Promise.resolve(pageCampaigns); },
    };
    return query;
  };
  Campaign.countDocuments = async () => 11;
  Donation.aggregate = async (pipeline) => {
    calls.pipeline = pipeline;
    return [{ _id: campaignId, raised: 25, contributors: 2 }];
  };

  const app = express();
  app.use("/api/discovery", discoveryRoutes);
  app.use(errorHandler);
  const server = app.listen(0, "127.0.0.1");

  try {
    await new Promise((resolve) => server.once("listening", resolve));
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/discovery/pastes?page=2`);
    assert.equal(response.status, 200);
    const body = await response.json();
    const invalidResponse = await fetch(`http://127.0.0.1:${port}/api/discovery/pastes?page=0`);
    assert.equal(invalidResponse.status, 400);

    assert.equal(calls.skip, DISCOVERY_PAGE_SIZE);
    assert.equal(calls.limit, 5);
    assert.deepEqual(calls.sort, { publishedAt: -1, _id: -1 });
    assert.equal(calls.filter.status, "published");
    assert.equal(calls.filter.$or.some((condition) => condition.deadline?.$gte instanceof Date), true);
    assert.equal(body.pageSize, 5);
    assert.equal(body.hasMore, true);
    assert.equal(body.pastes.length, 5);
    assert.deepEqual(body.pastes[0], {
      id: campaignId,
      title: "A community campaign",
      category: "Community",
      story: "A public story.",
      target: 100,
      currency: "NGN",
      assetScale: 2,
      deadline: "",
      openEnded: true,
      coverImage: "",
      status: "published",
      raised: 25,
      contributors: 2,
      publishedAt: campaign.publishedAt.toISOString(),
      creator: { displayName: "Campaign creator" },
    });
    assert.deepEqual(calls.pipeline[0], {
      $match: { campaignId: { $in: pageCampaigns.map((item) => item._id) } },
    });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
    Campaign.find = originalFind;
    Campaign.countDocuments = originalCountDocuments;
    Donation.aggregate = originalAggregate;
  }
});
