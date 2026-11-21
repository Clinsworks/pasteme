import { apiRequest } from "./api";

/**
 * Public discovery feed. This endpoint is intentionally separate from
 * GET /api/campaigns, which the creator dashboard uses for the signed-in
 * creator's own campaigns.
 */
export async function listDiscoverablePastes({ limit = 24, signal } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  const data = await apiRequest(`/api/discovery/pastes?${params.toString()}`, {
    signal,
    cache: "no-store",
  });

  const pastes = data.pastes ?? data.campaigns;
  if (!Array.isArray(pastes)) {
    throw new Error("The discovery feed returned an unexpected response.");
  }

  return pastes;
}

export async function getCommunityImpact({ signal } = {}) {
  return apiRequest("/api/community/impact", {
    signal,
    cache: "no-store",
  });
}

export async function getCommunityHighlights({ signal } = {}) {
  return apiRequest("/api/community/highlights", {
    signal,
    cache: "no-store",
  });
}
