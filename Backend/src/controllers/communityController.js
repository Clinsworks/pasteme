import { Campaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";

export async function getCommunityImpact(_request, response) {
  const now = new Date();
  const activeCampaignFilter = {
    status: "published",
    $or: [
      { openEnded: true },
      { deadline: null },
      { deadline: { $gte: now } },
    ],
  };
  const [totals, activePastes, contributors] = await Promise.all([
    Donation.aggregate([
      {
        $group: {
          _id: {
            currency: "$currency",
            assetScale: { $ifNull: ["$assetScale", 2] },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.currency": 1, "_id.assetScale": 1 } },
    ]),
    Campaign.countDocuments(activeCampaignFilter),
    Donation.countDocuments({}),
  ]);

  response.json({
    totalsByCurrency: totals.map((total) => ({
      amount: total.amount,
      currency: total._id.currency,
      assetScale: total._id.assetScale,
    })),
    studentsHelped: null,
    activePastes,
    contributors,
  });
}
