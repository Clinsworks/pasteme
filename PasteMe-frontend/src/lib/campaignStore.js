import { apiRequest } from "./api";

export async function listCampaigns() {
  const { campaigns } = await apiRequest("/api/campaigns");
  return campaigns;
}

export async function getPublishedCampaign(campaignId, options = {}) {
  const { campaign } = await apiRequest(
    `/api/campaigns/${encodeURIComponent(campaignId)}`,
    options
  );
  return campaign;
}

export async function getOwnerCampaign(campaignId, options = {}) {
  const { campaign } = await apiRequest(
    `/api/campaigns/${encodeURIComponent(campaignId)}/owner`,
    options
  );
  return campaign;
}

export async function getCampaignWalletAsset(walletAddress) {
  return apiRequest("/api/campaigns/wallet-asset", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
}

export async function saveCampaign(campaign) {
  const { id, ...body } = campaign;
  const result = id
    ? await apiRequest(`/api/campaigns/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      })
    : await apiRequest("/api/campaigns", {
        method: "POST",
        body: JSON.stringify(body),
      });
  return result.campaign;
}

export async function deleteCampaign(campaignId) {
  await apiRequest(`/api/campaigns/${encodeURIComponent(campaignId)}`, {
    method: "DELETE",
  });
}
