# PasteMe

PasteMe is a mobile-first fundraising app. Creators can publish and manage
fundraising campaigns; supporters can view them and authorize contributions
from an Open Payments-enabled wallet.

## Local setup

Requirements: Node.js 20.19+ or 22.12+, npm, and MongoDB.

Run the API first. See [Backend/README.md](../Backend/README.md) for MongoDB,
session-secret and Interledger test-wallet setup.

```powershell
Set-Location Backend
npm install
Copy-Item .env.example .env
npm run dev
```

In another terminal:

```powershell
Set-Location PasteMe-frontend
npm ci
npm run dev
```

Vite proxies `/api` calls to `http://localhost:5000`. Set `VITE_API_URL` in
`.env.local` only when the API is hosted at a different origin; configure the
API's `FRONTEND_URL` to allow that origin. Never put private credentials in a
`VITE_` variable.

## Application routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Homepage and featured Paste discovery | Public |
| `/explore` | Search and browse all active Pastes | Public |
| `/login`, `/signup` | Creator authentication | Guest |
| `/forgot-password` | Password recovery | Guest |
| `/dashboard` | Creator campaigns and verified contribution totals | Creator |
| `/create` | Campaign creation or editing | Creator |
| `/campaign-preview` | Review and publish a campaign | Creator |
| `/campaign-published/:id` | Share link and QR code | Campaign owner |
| `/c/:id` | Public campaign page | Public |
| `/c/:id/donate` | Contribution checkout | Signed-in supporter |

## Community discovery frontend

The homepage and `/explore` page call the discovery endpoints documented in
[DISCOVERY_FRONTEND_INTEGRATION.md](./DISCOVERY_FRONTEND_INTEGRATION.md).
These endpoints are separate from the creator-owned `/api/campaigns` feed.
Community totals, contributor highlights, and milestones must come from
confirmed platform activity. If those endpoints are unavailable, the UI shows
empty/error states rather than invented figures.

The fundraiser wizard supports student categories, optional university details,
and an optional goal at the UI level. The backend must accept the new category
values and optional `university`, `fundraisingFor`, and `target: null` fields for
those options to persist successfully. Checkout can send an optional `anonymous`
preference; the backend must persist and respect it in public contribution data.

## Real-service behavior

- Accounts use server-side password hashing and HTTP-only session cookies.
- Campaigns and donation records are stored in MongoDB. Wallet addresses are
  private campaign fields and are not returned by the public campaign endpoint.
- Checkout asks the backend for an Open Payments quote, redirects the supporter
  to their wallet for explicit authorization, and only adds a contribution after
  the receiver wallet confirms the incoming amount.
- Password recovery is unavailable until an email delivery service is
  configured. The API responds with an explicit error and does not claim to send
  an email.
- A campaign's receiving wallet determines its currency and asset scale.
  Payment initiation requires the backend Open Payments environment variables,
  wallet authorization and a working settlement rail. A supporter using a
  different currency depends on the wallet provider supporting conversion.
  Open Payments is a standard for payment instructions; it does not itself
  settle funds.

## Checks

```powershell
npm run lint
npm run build
```

For production, deploy both services over HTTPS, configure the frontend SPA
fallback for React Router routes, and point `API_PUBLIC_URL` at a publicly
reachable callback URL. The client wallet's private key, MongoDB credentials,
session secret and payment-data encryption key must remain server-side.

## PWA and QR links

The app includes a web app manifest, icons and a production service worker.
Campaign QR codes use the current deployed origin. The public campaign API is
required to open a shared campaign on a different device.

## Frontend design system

The interface uses the PasteMe palette (deep plum, muted sage, charcoal and ivory), a shared outline icon component, conversational English/Pidgin/Yorùbá copy, responsive layouts and restrained motion. See [FRONTEND_REFRESH_NOTES.md](./FRONTEND_REFRESH_NOTES.md) for the latest frontend-only changes and validation notes.
