import { Campaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";

export const DISCOVERY_PAGE_SIZE = 5;

function publicCampaign(campaign, stats) {
  const totals = stats.get(campaign._id);
  return {
    id: String(campaign._id),
    title: campaign.title,
    category: campaign.category,
    story: campaign.story,
    target: campaign.target,
    currency: campaign.currency || "NGN",
    assetScale: Number.isInteger(campaign.assetScale) ? campaign.assetScale : 2,
    deadline: campaign.deadline ? new Date(campaign.deadline).toISOString().slice(0, 10) : "",
    openEnded: campaign.openEnded,
    coverImage: campaign.coverImage,
    status: campaign.status,
    raised: totals?.raised || 0,
    contributors: totals?.contributors || 0,
    publishedAt: campaign.publishedAt,
    creator: campaign.creatorId?.name ? { displayName: campaign.creatorId.name } : undefined,
  };
}

export async function listDiscoverablePastes(request, response) {
  const page = request.discoveryPage;
  const offset = (page - 1) * DISCOVERY_PAGE_SIZE;
  const now = new Date();
  const filter = {
    status: "published",
    $or: [
      { openEnded: true },
      { deadline: null },
      { deadline: { $gte: now } },
    ],
  };

  const [campaigns, total] = await Promise.all([
    Campaign.find(filter)
      .sort({ publishedAt: -1, _id: -1 })
      .skip(offset)
      .limit(DISCOVERY_PAGE_SIZE)
      .populate({ path: "creatorId", select: "name" })
      .lean(),
    Campaign.countDocuments(filter),
  ]);
  const stats = campaigns.length
    ? await Donation.aggregate([
        { $match: { campaignId: { $in: campaigns.map((campaign) => campaign._id) } } },
        {
          $group: {
            _id: "$campaignId",
            raised: { $sum: "$amount" },
            contributors: { $sum: 1 },
          },
        },
      ])
    : [];
  const statsByCampaign = new Map(stats.map((item) => [item._id, item]));

  response.json({
    pastes: campaigns.map((campaign) => publicCampaign(campaign, statsByCampaign)),
    page,
    pageSize: DISCOVERY_PAGE_SIZE,
    hasMore: offset + campaigns.length < total,
  });
}
