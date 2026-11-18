# PasteMe application handover

## Integration status

The frontend is connected to the Express API in `../Backend` for account
sessions, campaign CRUD, public campaign lookup, and Open Payments checkout.
MongoDB stores creator accounts, campaigns, payment intents and verified
donations. Browser storage is retained only for interface language and
unpublished campaign drafts; it is not authoritative for accounts, published
campaigns, or payment status.

## Main user journeys

1. Creators register or log in through the API. Session cookies are HTTP-only.
2. Creators create, preview, publish, edit and archive campaigns. Receiving
   wallet addresses are stored privately and excluded from public responses.
3. The dashboard loads published campaigns and totals derived from settled
   donation records.
4. Supporters open a public campaign, request a quote and authorize an outgoing
   payment with their Open Payments wallet.
5. The backend verifies the authorization callback and checks the receiving
   wallet's incoming-payment resource before counting a contribution.

## API integration

The frontend sends same-origin `/api` requests by default. Vite proxies these
requests to `http://localhost:5000` in development. Set `VITE_API_URL` only when
using an API hosted on a different origin. See `../Backend/README.md` for the
API route table and configuration instructions.

## Intentional limitations

- Password recovery returns an explicit unavailable response until an email
  delivery service is selected and configured.
- The payment flow requires supported Open Payments wallets, a configured client
  wallet and keys, a supported recipient wallet, supporter approval and a working
  settlement rail. Open Payments supplies interoperable payment instructions;
  it does not itself move or settle funds.
- Campaign cover images are stored as data URLs in MongoDB and are limited to
  1 MB at upload.

## Deployment

Serve React Router paths through the SPA fallback. Use HTTPS for the frontend,
API and wallet callback; configure CORS with the exact frontend origin. Keep
MongoDB credentials, session secrets, payment encryption keys and Open Payments
private keys in server-side environment configuration.
