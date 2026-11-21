import { apiRequest } from "./api";

/**
 * Public discovery feed. This endpoint is intentionally separate from
 * GET /api/campaigns, which the creator dashboard uses for the signed-in
 * creator's own campaigns.
 */
export async function listDiscoverablePastes({ limit = 24, all = false, signal } = {}) {
  const pastes = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && (all || pastes.length < limit)) {
    const data = await apiRequest(`/api/discovery/pastes?page=${page}`, {
      signal,
      cache: "no-store",
    });
    const pagePastes = data.pastes ?? data.campaigns;
    if (!Array.isArray(pagePastes) || typeof data.hasMore !== "boolean") {
      throw new Error("The discovery feed returned an unexpected response.");
    }

    pastes.push(...pagePastes);
    hasMore = data.hasMore;
    page += 1;
  }

  return all ? pastes : pastes.slice(0, limit);
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
