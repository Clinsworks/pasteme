# PasteMe community discovery adaptation

This package applies the student-community discovery specification to the uploaded `PasteMe-landing-refresh(1).zip` frontend while preserving the existing PasteMe visual identity and page compositions.

## Frontend additions and changes

- Added the public `/explore` page with keyword search, student-need category filters, and newest / most-supported / closest-to-goal sorting.
- Added reusable Paste cards with creator and university details when supplied, real raised totals, optional goals, progress bars only when a goal exists, supporter counts, and View / Contribute actions.
- Expanded the existing landing page with featured Pastes, community impact statistics, supporter highlights, and recent milestones. The existing hero and established landing composition remain in place.
- Added clear loading, empty, request-error, and retry states. The UI does not invent community figures or campaign activity.
- Added student-oriented fundraiser categories, optional university information, and optional fundraising goals in the existing six-step creator wizard.
- Updated preview, published, dashboard, and public campaign presentation for creator/university details and goal-free Pastes.
- Kept public browsing available without sign-in and placed the contribution checkout route behind the existing creator/supporter authentication gate. After sign-in, the user returns to the intended checkout URL.
- Added the anonymous contribution preference to the frontend checkout request body.
- Kept English, Nigerian Pidgin, and Yorùbá translations for the new discovery and contribution messaging.

## Backend boundary

No backend code was included or modified. Existing frontend service modules and contracts were preserved:

- `src/context/AuthContext.jsx`
- `src/lib/api.js`
- `src/lib/campaignStore.js`
- `package.json` and `package-lock.json`
- `vite.config.js`

The new discovery UI expects the endpoints and response shapes documented in `DISCOVERY_FRONTEND_INTEGRATION.md`. Those endpoints are not implemented by this frontend package. Until the backend provides them, the landing and Explore screens show truthful error / empty states.

The campaign wizard now sends the optional `university` and `fundraisingFor` values, and sends `target: null` for a goal-free Paste. The existing campaign API and persistence layer must accept these fields for publishing to succeed. Checkout sends an additional `anonymous` boolean; the backend must preserve and honor it before public contributor data can reflect anonymous contributions. These requirements are documented for the backend team; this package does not implement them.

## Validation performed

- 30 JavaScript / JSX files parsed without syntax errors.
- 16 CSS files parsed without syntax errors.
- Relative imports resolved.
- Referenced icons were checked against the shared Icon component.
- JSON manifests were parsed.
- Core auth, API, campaign-store, dependency, and Vite config files were compared against the uploaded base archive and remain unchanged.

A full `npm run lint` and Vite production build were not completed in this environment because the extracted `node_modules` directory did not contain the ESLint executable and the available native build dependency was platform-specific. Run `npm ci`, `npm run lint`, and `npm run build` on the Windows development machine.
