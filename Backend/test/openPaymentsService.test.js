import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";

process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/pasteme-test";
process.env.AUTH_TOKEN_SECRET = "test-secret-value-that-is-at-least-32-characters";
process.env.OPEN_PAYMENTS_CLIENT_WALLET_ADDRESS = "https://wallet.example/client";
process.env.OPEN_PAYMENTS_PRIVATE_KEY = generateKeyPairSync("ed25519").privateKey
  .export({ format: "pem", type: "pkcs8" })
  .toString();
process.env.OPEN_PAYMENTS_PRIVATE_KEY_PATH = "missing-private-key.pem";
process.env.OPEN_PAYMENTS_KEY_ID = "test-key-id";

const { getOpenPaymentsClient } = await import("../src/services/openPaymentsService.js");

test("Open Payments client accepts a private key from environment configuration", async () => {
  const client = await getOpenPaymentsClient();

  assert.equal(typeof client.quote.create, "function");
});
