import { randomBytes, randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { Campaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";
import { PaymentIntent } from "../models/PaymentIntent.js";
import { HttpError } from "../middleware/errors.js";
import { decryptPaymentData, encryptPaymentData, verifyInteractionHash } from "../services/paymentCrypto.js";
import { getOpenPaymentsClient, isFinalizedGrantWithAccessToken, isPendingGrant } from "../services/openPaymentsService.js";
import { assertPublicWalletUrl } from "../services/walletUrl.js";

function requireEncryptionConfiguration() {
  const key = Buffer.from(env.PAYMENT_DATA_ENCRYPTION_KEY || "", "base64");
  if (key.length !== 32) {
    throw new HttpError(503, "Payments are unavailable until PAYMENT_DATA_ENCRYPTION_KEY is configured.");
  }
}

function toWalletAmount(amount, assetScale) {
  if (!Number.isInteger(assetScale) || assetScale < 0 || assetScale > 9) {
    throw new HttpError(502, "The receiving wallet returned an unsupported currency scale.");
  }
  return (BigInt(amount) * (10n ** BigInt(assetScale))).toString();
}

function publicQuote(quote) {
  return {
    receiveAmount: quote.receiveAmount,
    debitAmount: quote.debitAmount,
    expiresAt: quote.expiresAt,
  };
}

export function paymentReturnUrl(paymentIntent) {
  const destination = new URL(
    `/c/${encodeURIComponent(paymentIntent.campaignId)}/donate`,
    env.FRONTEND_URL
  );
  destination.searchParams.set("payment", "return");
  destination.searchParams.set("paymentIntentId", paymentIntent.id);
  return destination;
}

export async function createPaymentQuote(request, response) {
  requireEncryptionConfiguration();

  const campaign = await Campaign.findOne({
    _id: request.body.campaignId,
    status: "published",
  }).select("+walletAddress");
  if (!campaign) throw new HttpError(404, "Campaign not found.");
  if (!campaign.walletAddress) {
    throw new HttpError(409, "This campaign has not configured a receiving Open Payments wallet.");
  }
  if (!campaign.openEnded && campaign.deadline && campaign.deadline.getTime() < Date.now()) {
    throw new HttpError(409, "This campaign has ended and cannot accept contributions.");
  }

  const senderUrl = await assertPublicWalletUrl(request.body.senderWalletAddress);
  const receiverUrl = await assertPublicWalletUrl(campaign.walletAddress);
  const client = await getOpenPaymentsClient();
  const [sender, receiver] = await Promise.all([
    client.walletAddress.get({ url: senderUrl }),
    client.walletAddress.get({ url: receiverUrl }),
  ]);
  const [senderAuthServer, senderResourceServer, receiverAuthServer, receiverResourceServer] = await Promise.all([
    assertPublicWalletUrl(sender.authServer),
    assertPublicWalletUrl(sender.resourceServer),
    assertPublicWalletUrl(receiver.authServer),
    assertPublicWalletUrl(receiver.resourceServer),
  ]);

  if (
    receiver.assetCode !== (campaign.currency || "NGN") ||
    (campaign.assetScale != null && receiver.assetScale !== campaign.assetScale)
  ) {
    throw new HttpError(409, "The receiving wallet currency changed. Update the campaign to refresh its currency.");
  }

  const amountValue = toWalletAmount(request.body.amount, receiver.assetScale);
  const paymentIntentId = randomUUID();
  const callbackUrl = new URL(`/api/payments/${paymentIntentId}/callback`, env.API_PUBLIC_URL).href;
  const incomingExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const incomingGrant = await client.grant.request(
    { url: receiverAuthServer },
    {
      access_token: {
        access: [{
          type: "incoming-payment",
          actions: ["create", "read"],
        }],
      },
    }
  );
  if (!incomingGrant.access_token?.value) {
    throw new Error("The receiving wallet did not grant incoming-payment access.");
  }

  const incomingPayment = await client.incomingPayment.create(
    { url: receiverResourceServer, accessToken: incomingGrant.access_token.value },
    {
      walletAddress: receiver.id,
      incomingAmount: {
        value: amountValue,
        assetCode: receiver.assetCode,
        assetScale: receiver.assetScale,
      },
      expiresAt: incomingExpiresAt,
      metadata: { description: `PasteMe campaign contribution ${paymentIntentId}` },
    }
  );
  const incomingPaymentUrl = await assertPublicWalletUrl(incomingPayment.id);

  const quoteGrant = await client.grant.request(
    { url: senderAuthServer },
    {
      access_token: {
        access: [{ type: "quote", actions: ["create", "read"] }],
      },
    }
  );
  if (!quoteGrant.access_token?.value) {
    throw new Error("The sending wallet did not grant quote access.");
  }

  const quote = await client.quote.create(
    { url: senderResourceServer, accessToken: quoteGrant.access_token.value },
    {
      method: "ilp",
      walletAddress: sender.id,
      receiver: incomingPayment.id,
      receiveAmount: {
        value: amountValue,
        assetCode: receiver.assetCode,
        assetScale: receiver.assetScale,
      },
    }
  );

  if (!quote.debitAmount || !quote.receiveAmount || !quote.id) {
    throw new Error("The sending wallet returned an incomplete quote.");
  }
  if (
    String(quote.receiveAmount.value) !== amountValue ||
    quote.receiveAmount.assetCode !== receiver.assetCode ||
    quote.receiveAmount.assetScale !== receiver.assetScale ||
    BigInt(quote.debitAmount.value) <= 0n
  ) {
    throw new HttpError(502, "The sending wallet returned a quote that does not match the requested contribution.");
  }

  const clientNonce = randomBytes(32).toString("base64url");
  const outgoingGrant = await client.grant.request(
    { url: senderAuthServer },
    {
      access_token: {
        access: [{
          identifier: sender.id,
          type: "outgoing-payment",
          actions: ["read", "create"],
          limits: { debitAmount: quote.debitAmount },
        }],
      },
      interact: {
        start: ["redirect"],
        finish: {
          method: "redirect",
          uri: callbackUrl,
          nonce: clientNonce,
        },
      },
    }
  );
  if (!isPendingGrant(outgoingGrant) || !outgoingGrant.continue?.access_token?.value) {
    throw new Error("The sending wallet did not start an interactive payment grant.");
  }
  if (!outgoingGrant.interact.redirect || !outgoingGrant.continue.uri) {
    throw new Error("The sending wallet returned an incomplete authorization grant.");
  }
  await Promise.all([
    assertPublicWalletUrl(outgoingGrant.continue.uri),
    assertPublicWalletUrl(outgoingGrant.interact.redirect, { allowQuery: true }),
  ]);

  const expiresAt = quote.expiresAt ? new Date(quote.expiresAt) : new Date(Date.now() + 10 * 60 * 1000);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
    throw new HttpError(502, "The sending wallet returned an expired quote.");
  }

  const protectedData = encryptPaymentData({
    senderWalletAddress: sender.id,
    senderAuthServer,
    senderResourceServer,
    incomingPaymentUrl,
    incomingAmount: incomingPayment.incomingAmount,
    incomingAccessToken: incomingGrant.access_token.value,
    quoteId: quote.id,
    clientNonce,
    interactNonce: outgoingGrant.interact.finish,
    continueUrl: outgoingGrant.continue.uri,
    continueAccessToken: outgoingGrant.continue.access_token.value,
    outgoingInteractRedirect: outgoingGrant.interact.redirect,
  });

  await PaymentIntent.create({
    _id: paymentIntentId,
    campaignId: campaign.id,
    amount: request.body.amount,
    currency: receiver.assetCode,
    assetScale: receiver.assetScale,
    quote: publicQuote(quote),
    protectedData,
    expiresAt,
  });

  response.status(201).json({
    paymentIntentId,
    quote: publicQuote(quote),
  });
}

export async function authorizePayment(request, response) {
  const intent = await PaymentIntent.findById(request.params.paymentIntentId);
  if (!intent) throw new HttpError(404, "Payment intent not found.");
  if (intent.status !== "awaiting_authorization") {
    throw new HttpError(409, "This payment is no longer awaiting wallet authorization.");
  }
  if (intent.expiresAt.getTime() <= Date.now()) {
    intent.status = "failed";
    await intent.save();
    throw new HttpError(410, "This quote has expired. Request a new quote.");
  }

  const data = decryptPaymentData(intent.protectedData);
  const authorizationUrl = await assertPublicWalletUrl(data.outgoingInteractRedirect, {
    allowQuery: true,
  });
  response.json({ authorizationUrl });
}

export async function handlePaymentAuthorization(request, response) {
  const intent = await PaymentIntent.findOneAndUpdate(
    { _id: request.params.paymentIntentId, status: "awaiting_authorization" },
    { $set: { status: "processing" } },
    { returnDocument: "after" }
  );
  if (!intent) {
    const existing = await PaymentIntent.findById(request.params.paymentIntentId);
    if (!existing) throw new HttpError(404, "Payment intent not found.");
    return response.redirect(paymentReturnUrl(existing).href);
  }
  const destination = paymentReturnUrl(intent);

  if (intent.expiresAt.getTime() <= Date.now()) {
    console.warn("Open Payments authorization callback arrived after the quote expired.");
    intent.status = "failed";
    await intent.save();
    return response.redirect(destination.href);
  }

  const { interact_ref: interactRef, hash: receivedHash, error } = request.query;
  if (error || typeof interactRef !== "string" || typeof receivedHash !== "string") {
    console.warn(
      error
        ? "Open Payments authorization was declined or rejected."
        : "Open Payments callback was missing interaction parameters."
    );
    intent.status = "failed";
    await intent.save();
    return response.redirect(destination.href);
  }

  const data = decryptPaymentData(intent.protectedData);
  if (!verifyInteractionHash({
    clientNonce: data.clientNonce,
    interactNonce: data.interactNonce,
    interactRef,
    grantUrl: data.senderAuthServer,
    receivedHash,
  })) {
    console.warn("Open Payments interaction hash verification failed.");
    intent.status = "failed";
    await intent.save();
    return response.redirect(destination.href);
  }

  try {
    const client = await getOpenPaymentsClient();
    const grant = await client.grant.continue(
      { url: data.continueUrl, accessToken: data.continueAccessToken },
      { interact_ref: interactRef }
    );
    if (!isFinalizedGrantWithAccessToken(grant)) {
      throw new Error("The sending wallet did not finalize the payment grant.");
    }

    const outgoingPayment = await client.outgoingPayment.create(
      { url: data.senderResourceServer, accessToken: grant.access_token.value },
      {
        walletAddress: data.senderWalletAddress,
        quoteId: data.quoteId,
        metadata: { description: `PasteMe campaign contribution ${intent.id}` },
      }
    );
    const outgoingPaymentUrl = await assertPublicWalletUrl(outgoingPayment.id);

    data.outgoingAccessToken = grant.access_token.value;
    data.outgoingPaymentUrl = outgoingPaymentUrl;
    intent.protectedData = encryptPaymentData(data);
    intent.status = "pending";
    await intent.save();
  } catch (error) {
    intent.status = "failed";
    await intent.save();
    throw error;
  }
  response.redirect(destination.href);
}

export async function paymentStatus(request, response) {
  const intent = await PaymentIntent.findById(request.params.paymentIntentId);
  if (!intent) throw new HttpError(404, "Payment intent not found.");
  if (intent.status === "settled" || intent.status === "failed") {
    return response.json({ status: intent.status });
  }
  if (intent.status === "awaiting_authorization" && intent.expiresAt.getTime() <= Date.now()) {
    intent.status = "failed";
    await intent.save();
    return response.json({ status: "failed" });
  }
  if (intent.status !== "pending") {
    return response.json({ status: "pending" });
  }

  const data = decryptPaymentData(intent.protectedData);
  const client = await getOpenPaymentsClient();
  const incomingPayment = await client.incomingPayment.get({
    url: data.incomingPaymentUrl,
    accessToken: data.incomingAccessToken,
  });

  if (BigInt(incomingPayment.receivedAmount.value) >= BigInt(data.incomingAmount.value)) {
    try {
      await Donation.updateOne(
        { paymentIntentId: intent.id },
        {
          $setOnInsert: {
            campaignId: intent.campaignId,
            paymentIntentId: intent.id,
            amount: intent.amount,
            currency: intent.currency,
            assetScale: intent.assetScale ?? 2,
          },
        },
        { upsert: true }
      );
    } catch (error) {
      if (error?.code !== 11000) throw error;
    }
    intent.status = "settled";
    intent.settledAt = new Date();
    await intent.save();
    return response.json({ status: "settled" });
  }

  if (incomingPayment.completed) {
    console.warn("Open Payments incoming payment completed without the requested amount.");
    intent.status = "failed";
    await intent.save();
    return response.json({ status: "failed" });
  }

  if (data.outgoingPaymentUrl && data.outgoingAccessToken) {
    const outgoingPayment = await client.outgoingPayment.get({
      url: data.outgoingPaymentUrl,
      accessToken: data.outgoingAccessToken,
    });
    if (outgoingPayment.failed) {
      console.warn("Open Payments sender wallet reported the outgoing payment as failed.");
      intent.status = "failed";
      await intent.save();
      return response.json({ status: "failed" });
    }
  }

  response.json({ status: "pending" });
}
