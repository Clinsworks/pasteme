# PasteMe Frontend Refresh Notes

This refresh is limited to `PasteMe-frontend`. No backend directory, server source, database schema, payment service, authentication API, API contract, or environment secret was edited.

## Design direction

The UI now leans into a more editorial, human and locally approachable product feel while preserving the PasteMe palette:

- Deep plum: `#54265F`
- Muted sage: `#A9C5A0`
- Charcoal: `#302B32`
- Ivory: `#F7F5F0`

The shared visual layer tightens typography, whitespace, card treatment, focus states, buttons, form controls and responsive layouts. It reduces heavy blur, oversized decoration and repetitive visual effects. Motion is limited to small page/step entrances, hover feedback and progress transitions, and it respects `prefers-reduced-motion`.

## Frontend changes

- Added a shared `Icon` component with consistent Lucide-style outline SVG icons. It keeps icon styling centralized and adds no runtime dependency.
- Updated the Landing page to use consistent icons and a calmer editorial hero treatment.
- Applied shared typography, spacing, surface, button, field, focus and responsive refinements through `src/styles/visual-refresh.css`.
- Kept the shared motion system restrained and accessible through `src/styles/motion.css`, `ScrollReveal` and `ScrollToTop`.
- Reused shared campaign-category translations on Campaign Preview, Public Campaign, Published and Checkout.
- Improved language consistency for password recovery and route-loading feedback.
- Corrected the campaign cover/QR icon treatment and the phone-preview overflow/menu mark.
- Updated PWA browser icons and social metadata to point at assets in `public/` rather than a source-only path.

## Preserved integrations (unchanged)

The following files are byte-for-byte unchanged from the uploaded project:

- `src/context/AuthContext.jsx`
- `src/lib/api.js`
- `src/lib/campaignStore.js`
- `package.json`

The API-related request logic in these existing frontend components was also left unchanged:

- `src/pages/CreCamp/CreCamp.jsx` — wallet asset lookup remains `getCampaignWalletAsset(...)`.
- `src/pages/CampaignPrev/CampaignPrev.jsx` — campaign persistence remains `saveCampaign(...)`.
- `src/pages/Published/Published.jsx` — owner campaign retrieval remains `getOwnerCampaign(...)`.
- `src/pages/Public/Public.jsx` — public campaign retrieval remains `getPublishedCampaign(...)`.
- `src/pages/Checkout/Checkout.jsx` — quote, authorize and status requests remain on their existing `/api/payments/...` endpoints.
- `src/pages/Dashboard/Dashboard.jsx` — campaign listing and deletion remain on `listCampaigns(...)` and `deleteCampaign(...)`.

No backend route, request/response shape, payment authorization sequence, wallet privacy behavior or authentication flow was redesigned.

## Validation completed

- ESLint: passed using the installed ESLint Node entry point.
- JavaScript/JSX syntax: 27 files parsed, no syntax errors.
- Relative imports: no unresolved relative imports.
- Icon references: no missing icon names found.
- CSS/PostCSS parsing: 14 files parsed, no syntax errors.
- JSON: `package.json`, `package-lock.json` and `public/manifest.webmanifest` parsed successfully.

## Build limitation in this review environment

A Vite production build could not be completed in this Linux review container. The archived `node_modules` does not contain the matching Linux Rolldown native optional binding. This is a platform/dependency installation issue, not a diagnosed application source error. On the development machine, restore dependencies for that platform and run:

```bash
npm ci
npm run lint
npm run build
```

## Handover

This package contains the frontend folder only. Keep the existing `Backend` folder exactly as it is. Replace the current `PasteMe-frontend` folder with this reviewed folder, then run the commands above from `PasteMe-frontend`.
