# PasteMe API

Express API for PasteMe, using MongoDB/Mongoose and the official
`@interledger/open-payments` Node SDK. The API owns account sessions, campaign
storage, donation totals, payment authorization and payment verification.

## Run locally

1. Start a MongoDB instance.
2. In `Backend`, install packages and create a local environment file:

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

3. Set `AUTH_TOKEN_SECRET` to a random value of at least 32 characters. Generate
   a `PAYMENT_DATA_ENCRYPTION_KEY` with the command in `.env.example`.
4. Start the server:

   ```powershell
   npm run dev
   ```

The local API listens on `http://localhost:5000`; `GET /api/health` is its
health check. The frontend Vite server proxies `/api` requests to this API.

## Open Payments setup

The checkout uses the Open Payments API and Interledger's Node SDK. The
campaign's receiving wallet determines its currency and asset scale, and the
contribution amount is entered in that currency. The quote shows the amount
debited from the supporter's wallet in its own currency; the wallet provider
and underlying rail perform the conversion when supported. Open Payments
standardizes payment instructions and user authorization.

To use the Interledger test network:

1. Create and verify a test wallet at
   [wallet.interledger-test.dev](https://wallet.interledger-test.dev/).
2. Create and fund an account for the campaign receiver in the currency you
   want to fundraise in; create a wallet address and use that HTTPS wallet URL
   in the campaign's receiving-wallet field. PasteMe reads the wallet's asset
   code and scale and uses them for the goal, contribution, and campaign totals.
3. Create a client wallet address and developer key for PasteMe. Verify that
   `{client-wallet-address}/jwks.json` publishes the matching Ed25519 public
   key with the exact key ID configured in `OPEN_PAYMENTS_KEY_ID`. Configure
   the address and key ID in `OPEN_PAYMENTS_CLIENT_WALLET_ADDRESS` and
   `OPEN_PAYMENTS_KEY_ID`. For deployments, set the private key contents in
   the secret `OPEN_PAYMENTS_PRIVATE_KEY` variable; for local development, you
   can instead set `OPEN_PAYMENTS_PRIVATE_KEY_PATH` to a key file. Keep the
   private key outside source control.
4. Configure `API_PUBLIC_URL` to the publicly reachable HTTPS API origin when
   testing wallet authorization redirects. Configure `FRONTEND_URL` to the
   frontend origin.
5. A supporter enters their own Open Payments wallet address at checkout and
   approves the outgoing-payment grant in their wallet's authorization flow.

No payment is simulated. Missing payment configuration, unsupported wallet
currencies, expired quotes, rejected authorization or unavailable settlement
rails produce an error or non-settled status. Payment
grant tokens and wallet resource details are encrypted in MongoDB using
`PAYMENT_DATA_ENCRYPTION_KEY`. Back up this key securely; losing it prevents
pending intents from being completed.

## Password recovery

Registration and login use password hashes and an HTTP-only session cookie.
`POST /api/auth/forgot-password` returns `503` until an email delivery service
is selected and configured. No recovery email is claimed to have been sent.

## API routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | API health |
| `POST` | `/api/auth/signup` | Public | Create an account and session |
| `POST` | `/api/auth/login` | Public | Verify credentials and create session |
| `POST` | `/api/auth/logout` | Public | Clear the session cookie |
| `GET` | `/api/auth/me` | Session | Restore the current user |
| `POST` | `/api/auth/forgot-password` | Public | Explicitly unavailable until email is configured |
| `GET` | `/api/campaigns` | Session | List the creator's published campaigns |
| `POST` | `/api/campaigns/wallet-asset` | Session | Resolve a receiving wallet's currency for campaign preview |
| `POST` | `/api/campaigns` | Session | Publish a campaign |
| `GET` | `/api/campaigns/:id` | Public | Retrieve a public campaign and verified totals |
| `GET` | `/api/campaigns/:id/owner` | Owner session | Retrieve a campaign including its private receiving wallet |
| `PATCH` | `/api/campaigns/:id` | Owner session | Update campaign details |
| `DELETE` | `/api/campaigns/:id` | Owner session | Archive a campaign |
| `POST` | `/api/payments/quote` | Public | Create receiver payment, quote and interactive sender grant |
| `POST` | `/api/payments/:id/authorize` | Public | Return the wallet's HTTPS authorization URL |
| `GET` | `/api/payments/:id/callback` | Open Payments redirect | Verify interaction hash, continue grant and create outgoing payment |
| `GET` | `/api/payments/:id/status` | Public | Verify recipient receipt and record a settled contribution |

Campaign totals are derived from unique, verified donation records; browser
state and payment redirect parameters are never treated as proof of payment.
