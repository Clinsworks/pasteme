import assert from "node:assert/strict";
import test from "node:test";

process.env.MONGODB_URI ||= "mongodb://127.0.0.1:27017/pasteme-test";
process.env.AUTH_TOKEN_SECRET ||= "test-only-auth-token-secret-at-least-32-characters";

const { paymentReturnUrl } = await import("../src/controllers/paymentController.js");

test("payment authorization returns to the campaign checkout with its intent ID", () => {
  const campaignId = "d3b07384-d9a0-4a2d-a5a2-193efb847c36";
  const paymentIntentId = "d3b07384-d9a0-4a2d-a5a2-193efb847c37";
  const destination = paymentReturnUrl({ id: paymentIntentId, campaignId });

  assert.equal(destination.pathname, `/c/${campaignId}/donate`);
  assert.equal(destination.searchParams.get("payment"), "return");
  assert.equal(destination.searchParams.get("paymentIntentId"), paymentIntentId);
});
