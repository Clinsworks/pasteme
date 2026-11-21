# PasteMe community discovery frontend integration

This document describes the frontend discovery contract and the backend endpoint that serves it.

## New public frontend route

- `GET /explore` is implemented as the Explore Pastes page.
- The landing page now includes community impact, featured Pastes, and community highlights.
- Visitors can browse without signing in. The contribution route `/c/:id/donate` remains behind the existing `ProtectedRoute`; after login/signup, the app returns the visitor to the intended checkout URL.

## Frontend API calls required

The frontend uses `src/lib/discoveryStore.js` for discovery-only calls. This is intentionally separate from `listCampaigns()` because the existing `/api/campaigns` endpoint is used by the signed-in creator workspace.

### `GET /api/discovery/pastes?page=1`

The backend returns campaigns in pages of five. `hasMore` indicates whether a
subsequent page is available; the Explore client requests pages until it has
loaded the full feed. The homepage only requests enough pages to render its
featured items.

Response:

```json
{
  "page": 1,
  "pageSize": 5,
  "hasMore": true,
  "pastes": [
    {
      "id": "paste-id",
      "status": "published",
      "title": "Help me cover my semester fees",
      "story": "A short public campaign story",
      "shortDescription": "Optional shorter card copy",
      "category": "Tuition",
      "coverImage": "https://...",
      "raised": 45000,
      "target": 100000,
      "currency": "NGN",
      "assetScale": 2,
      "contributors": 12,
      "deadline": "2026-12-15",
      "openEnded": false,
      "publishedAt": "2026-11-15T12:00:00.000Z",
      "creator": { "displayName": "A student", "university": "A university" },
      "university": "A university"
    }
  ]
}
```

The `target` may be `null` or omitted. In that case the UI shows the amount raised and supporter count, but no progress bar. Campaign data must be public-safe: never return receiving wallet URLs, wallet identifiers marked private, credentials, or payment secrets. `raised` and `contributors` are based on confirmed contribution records. Only published, non-expired campaigns are returned (the frontend also filters statuses/deadlines defensively).

The existing campaign categories have been extended in the frontend with student-centred options: Tuition, Accommodation, Academic Materials, and Emergency. The backend's category validation/model must accept those values before they can be saved successfully. Existing category values remain available.

### `GET /api/community/impact`

Expected public-safe fields:

```json
{
  "totalsByCurrency": [
    { "amount": 125000, "currency": "NGN", "assetScale": 2 }
  ],
  "studentsHelped": 18,
  "activePastes": 24,
  "contributors": 91
}
```

All statistics must be calculated from confirmed activity. `studentsHelped` must use a valid beneficiary count or confirmed impact data supplied by the campaign; do not infer it from contributor counts or campaign counts. Do not return fabricated or estimated success metrics. The UI displays placeholders/empty copy when the endpoint has no data, and a separate retry state when it is unavailable.

### `GET /api/community/highlights`

Expected public-safe fields:

```json
{
  "topContributors": [
    {
      "displayName": "Public display name",
      "contributionTotal": 12000,
      "currency": "NGN",
      "assetScale": 2,
      "anonymous": false
    },
    { "anonymous": true }
  ],
  "recentMilestones": [
    {
      "campaignId": "paste-id",
      "campaignTitle": "Help me cover my semester fees",
      "progressPercent": 50
    }
  ]
}
```

Only confirmed contributions from the trailing 30-day period may be counted for the default leaderboard. If a supporter opted for anonymity, their identity and contribution amount must not be exposed in public results. `progressPercent` is expected in the 0–100 range and milestones should represent genuine goal milestones (25%, 50%, 75%, 100%).

## Additional campaign fields

The campaign wizard now sends `university` and `fundraisingFor` when present. The campaign API needs to accept and persist these optional fields and return only the public-safe values to the discovery/public campaign views.

The wizard permits an optional fundraising goal and sends `target: null` when no goal is selected. The campaign create/update API and persistence model need to accept a missing or null target. Until the backend supports this, the frontend can render the no-goal experience but the server may reject publishing a goal-free Paste.

## Anonymous contribution preference

Checkout now includes an optional `anonymous` boolean in the existing quote request body. The payments backend needs to preserve this preference with the resulting contribution and apply it to public contributor/highlight data. This is a new request field; the frontend does not implement or change payment verification.

## What is deliberately unchanged

- `src/context/AuthContext.jsx`
- `src/lib/api.js`
- `src/lib/campaignStore.js`
- Existing authentication, campaign CRUD, wallet-asset lookup, and payment authorization/verification calls
- `package.json`, `package-lock.json`, Vite configuration, and backend code

The frontend calls the new discovery endpoints but does not create them. If they are not yet implemented by the backend, the homepage and Explore page show truthful empty/error states rather than mock totals or fake contributors.
