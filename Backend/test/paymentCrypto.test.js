import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import test from "node:test";
import { decryptPaymentData, encryptPaymentData, verifyInteractionHash } from "../src/services/paymentCrypto.js";
import { assertPublicWalletUrl } from "../src/services/walletUrl.js";

process.env.PAYMENT_DATA_ENCRYPTION_KEY = randomBytes(32).toString("base64");

test("payment data is encrypted and round-trips", () => {
  const value = { accessToken: "private-token", nested: { value: 42 } };
  const encrypted = encryptPaymentData(value);

  assert.notEqual(encrypted, JSON.stringify(value));
  assert.deepEqual(decryptPaymentData(encrypted), value);
});

test("tampered payment data is rejected", () => {
  const encrypted = encryptPaymentData({ accessToken: "private-token" });
  const [iv, tag, ciphertext] = encrypted.split(".");
  const ciphertextBytes = Buffer.from(ciphertext, "base64url");
  ciphertextBytes[0] ^= 1;

  assert.throws(() => decryptPaymentData(`${iv}.${tag}.${ciphertextBytes.toString("base64url")}`));
});

test("Open Payments interaction callback hash is verified", () => {
  const officialExample = {
    clientNonce: "VJLO6A4CATR0KRO",
    interactNonce: "MBDOFXG4Y5CVJCX821LH",
    interactRef: "4IFWWIKYB2PQ6U56NL1",
    grantUrl: "https://server.example.com/tx",
  };
  assert.equal(verifyInteractionHash({
    ...officialExample,
    receivedHash: "x-gguKWTj8rQf7d7i3w3UhzvuJ5bpOlKyAlVpLxBffY",
  }), true);
  assert.equal(verifyInteractionHash({
    ...officialExample,
    receivedHash: "x+gguKWTj8rQf7d7i3w3UhzvuJ5bpOlKyAlVpLxBffY",
  }), true);
  assert.equal(verifyInteractionHash({
    ...officialExample,
    receivedHash: "x gguKWTj8rQf7d7i3w3UhzvuJ5bpOlKyAlVpLxBffY",
  }), true);

  const values = {
    clientNonce: "client-nonce",
    interactNonce: "server-nonce",
    interactRef: "interaction-reference",
    grantUrl: "https://wallet.example/auth",
  };
  const receivedHash = createHash("sha256")
    .update(`${values.clientNonce}\n${values.interactNonce}\n${values.interactRef}\n${values.grantUrl}`)
    .digest("base64url");

  assert.equal(verifyInteractionHash({ ...values, receivedHash }), true);
  const normalizedHash = createHash("sha256")
    .update(`${values.clientNonce}\n${values.interactNonce}\n${values.interactRef}\nhttps://wallet.example/`)
    .digest("base64url");
  assert.equal(verifyInteractionHash({
    ...values,
    grantUrl: "https://wallet.example",
    receivedHash: normalizedHash,
  }), true);
  assert.equal(verifyInteractionHash({ ...values, receivedHash: "invalid" }), false);
  assert.equal(verifyInteractionHash({ ...values, interactRef: "", receivedHash }), false);
});

test("wallet addresses that target local services are rejected", async () => {
  await assert.rejects(assertPublicWalletUrl("http://wallet.example/alice"));
  await assert.rejects(assertPublicWalletUrl("https://localhost/alice"));
  await assert.rejects(assertPublicWalletUrl("https://127.0.0.1/alice"));
  await assert.rejects(assertPublicWalletUrl("https://[::ffff:127.0.0.1]/alice"));
  await assert.rejects(assertPublicWalletUrl("https://localhost/authorize?grant=1", { allowQuery: true }));
});
