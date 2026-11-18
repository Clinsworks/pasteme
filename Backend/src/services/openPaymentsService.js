import {
  createAuthenticatedClient,
  createUnauthenticatedClient,
  isFinalizedGrantWithAccessToken,
  isPendingGrant,
} from "@interledger/open-payments";
import { env } from "../config/env.js";
import { HttpError } from "../middleware/errors.js";

let clientPromise;
let publicClientPromise;

export async function getOpenPaymentsPublicClient() {
  if (!publicClientPromise) {
    publicClientPromise = createUnauthenticatedClient({ requestTimeoutMs: 10000 }).catch((error) => {
      publicClientPromise = undefined;
      throw error;
    });
  }
  return publicClientPromise;
}

export async function getOpenPaymentsClient() {
  const { OPEN_PAYMENTS_CLIENT_WALLET_ADDRESS, OPEN_PAYMENTS_PRIVATE_KEY_PATH, OPEN_PAYMENTS_KEY_ID } = env;
  if (!OPEN_PAYMENTS_CLIENT_WALLET_ADDRESS || !OPEN_PAYMENTS_PRIVATE_KEY_PATH || !OPEN_PAYMENTS_KEY_ID) {
    throw new HttpError(503, "Open Payments is not configured. Add the client wallet address, key ID, and private key path.");
  }

  if (!clientPromise) {
    clientPromise = createAuthenticatedClient({
      walletAddressUrl: OPEN_PAYMENTS_CLIENT_WALLET_ADDRESS,
      privateKey: OPEN_PAYMENTS_PRIVATE_KEY_PATH,
      keyId: OPEN_PAYMENTS_KEY_ID,
      requestTimeoutMs: 10000,
    }).catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }
  return clientPromise;
}

export { isFinalizedGrantWithAccessToken, isPendingGrant };
