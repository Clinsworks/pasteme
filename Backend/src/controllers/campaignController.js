import { Campaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";
import { HttpError } from "../middleware/errors.js";
import { getOpenPaymentsPublicClient } from "../services/openPaymentsService.js";
import { assertPublicWalletUrl } from "../services/walletUrl.js";

function campaignData(campaign, { includeWallet = false, raised = 0, contributors = 0 } = {}) {
  const value = typeof campaign.toObject === "function" ? campaign.toObject() : campaign;
  return {
    id: String(value._id),
    title: value.title,
    category: value.category,
    story: value.story,
    target: value.target,
    currency: value.currency || "NGN",
    assetScale: Number.isInteger(value.assetScale) ? value.assetScale : 2,
    deadline: value.deadline ? new Date(value.deadline).toISOString().slice(0, 10) : "",
    openEnded: value.openEnded,
    coverImage: value.coverImage,
    status: value.status,
    raised,
    contributors,
    publishedAt: value.publishedAt,
    updatedAt: value.updatedAt,
    ...(includeWallet ? { walletAddress: value.walletAddress || "" } : {}),
  };
}

async function campaignStats(campaignIds) {
  if (!campaignIds.length) return new Map();
  const result = await Donation.aggregate([
    { $match: { campaignId: { $in: campaignIds } } },
    {
      $group: {
        _id: "$campaignId",
        raised: { $sum: "$amount" },
        contributors: { $sum: 1 },
      },
    },
  ]);
  return new Map(result.map((entry) => [entry._id, entry]));
}

function validateDeadline(deadline, openEnded) {
  if (openEnded) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline || "")) {
    throw new HttpError(400, "Choose a campaign deadline in the future or make the campaign open-ended.");
  }
  const parsed = new Date(`${deadline}T23:59:59.999Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== deadline ||
    parsed.getTime() < Date.now()
  ) {
    throw new HttpError(400, "Choose a campaign deadline in the future or make the campaign open-ended.");
  }
  return parsed;
}

async function resolveCampaignWallet(walletAddress) {
  const url = await assertPublicWalletUrl(walletAddress);
  const client = await getOpenPaymentsPublicClient();
  const wallet = await client.walletAddress.get({ url });
  if (
    typeof wallet.assetCode !== "string" ||
    !wallet.assetCode.trim() ||
    wallet.assetCode.length > 32 ||
    !Number.isInteger(wallet.assetScale) ||
    wallet.assetScale < 0 ||
    wallet.assetScale > 9
  ) {
    throw new HttpError(502, "The receiving wallet returned unsupported currency details.");
  }
  return { walletAddress: url, currency: wallet.assetCode, assetScale: wallet.assetScale };
}

export async function inspectCampaignWallet(request, response) {
  const { currency, assetScale } = await resolveCampaignWallet(request.body.walletAddress);
  response.json({ currency, assetScale });
}

async function campaignInput(body) {
  const wallet = await resolveCampaignWallet(body.walletAddress);
  return {
    title: body.title.trim(),
    category: body.category,
    story: body.story.trim(),
    target: body.target,
    ...wallet,
    openEnded: body.openEnded,
    deadline: validateDeadline(body.deadline, body.openEnded),
    coverImage: body.coverImage || "",
  };
}

export async function listCampaigns(request, response) {
  const campaigns = await Campaign.find({ creatorId: request.user.id, status: "published" })
    .sort({ publishedAt: -1 })
    .lean();
  const stats = await campaignStats(campaigns.map((campaign) => campaign._id));
  response.json({
    campaigns: campaigns.map((campaign) => {
      const totals = stats.get(campaign._id);
      return campaignData(campaign, {
        raised: totals?.raised || 0,
        contributors: totals?.contributors || 0,
      });
    }),
  });
}

export async function getPublicCampaign(request, response) {
  const campaign = await Campaign.findOne({ _id: request.params.campaignId, status: "published" }).lean();
  if (!campaign) throw new HttpError(404, "Campaign not found.");
  const stats = await campaignStats([campaign._id]);
  const totals = stats.get(campaign._id);
  response.json({
    campaign: campaignData(campaign, {
      raised: totals?.raised || 0,
      contributors: totals?.contributors || 0,
    }),
  });
}

export async function getOwnerCampaign(request, response) {
  const campaign = await Campaign.findOne({
    _id: request.params.campaignId,
    creatorId: request.user.id,
    status: "published",
  }).select("+walletAddress");
  if (!campaign) throw new HttpError(404, "Campaign not found.");
  const stats = await campaignStats([campaign.id]);
  const totals = stats.get(campaign.id);
  response.json({
    campaign: campaignData(campaign, {
      includeWallet: true,
      raised: totals?.raised || 0,
      contributors: totals?.contributors || 0,
    }),
  });
}

export async function createCampaign(request, response) {
  const campaign = await Campaign.create({
    ...(await campaignInput(request.body)),
    creatorId: request.user.id,
    status: "published",
  });
  response.status(201).json({ campaign: campaignData(campaign, { includeWallet: true }) });
}

export async function updateCampaign(request, response) {
  const campaign = await Campaign.findOne({
    _id: request.params.campaignId,
    creatorId: request.user.id,
    status: "published",
  }).select("+walletAddress");
  if (!campaign) throw new HttpError(404, "Campaign not found.");

  Object.assign(campaign, await campaignInput(request.body));
  await campaign.save();
  const stats = await campaignStats([campaign.id]);
  const totals = stats.get(campaign.id);
  response.json({
    campaign: campaignData(campaign, {
      includeWallet: true,
      raised: totals?.raised || 0,
      contributors: totals?.contributors || 0,
    }),
  });
}

export async function deleteCampaign(request, response) {
  const campaign = await Campaign.findOneAndUpdate(
    { _id: request.params.campaignId, creatorId: request.user.id, status: "published" },
    { $set: { status: "archived" } },
    { returnDocument: "after" }
  );
  if (!campaign) throw new HttpError(404, "Campaign not found.");
  response.status(204).end();
}

export const campaignSchema = (z) => z.object({
  title: z.string().trim().min(1).max(80),
  category: z.enum(["Education", "Medical", "Community", "Personal", "Business", "Other"]),
  story: z.string().trim().min(1).max(1500),
  target: z.coerce.number().finite().int().positive().max(Number.MAX_SAFE_INTEGER),
  deadline: z.string().optional().default(""),
  openEnded: z.boolean().default(false),
  coverImage: z.string().max(1_400_000).regex(/^$|^data:image\/(png|jpeg|webp);base64,/).optional().default(""),
  walletAddress: z.string().trim().min(1),
});
