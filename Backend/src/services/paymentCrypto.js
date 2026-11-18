import { createHash, createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from "node:crypto";
import { HttpError } from "../middleware/errors.js";

function getEncryptionKey() {
  const key = Buffer.from(process.env.PAYMENT_DATA_ENCRYPTION_KEY || "", "base64");
  if (key.length !== 32) {
    throw new HttpError(503, "Payments are unavailable until PAYMENT_DATA_ENCRYPTION_KEY is configured.");
  }
  return key;
}

export function encryptPaymentData(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function decryptPaymentData(value) {
  const [ivValue, tagValue, ciphertextValue] = value.split(".");
  if (!ivValue || !tagValue || !ciphertextValue) {
    throw new Error("Stored payment data is invalid.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivValue, "base64url")
  );
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, "base64url")),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString("utf8"));
}

export function verifyInteractionHash({ clientNonce, interactNonce, interactRef, grantUrl, receivedHash }) {
  if (![clientNonce, interactNonce, interactRef, grantUrl, receivedHash].every(Boolean)) {
    return false;
  }

  let normalizedGrantUrl;
  try {
    normalizedGrantUrl = new URL(grantUrl).href;
  } catch {
    return false;
  }

  const expected = createHash("sha256")
    .update(`${clientNonce}\n${interactNonce}\n${interactRef}\n${normalizedGrantUrl}`)
    .digest();
  const normalizedHash = receivedHash.replace(/ /g, "+");
  if (!/^[A-Za-z0-9+/_-]{43}=?$/.test(normalizedHash)) {
    return false;
  }
  const receivedBuffer = Buffer.from(normalizedHash, "base64");

  return expected.length === receivedBuffer.length &&
    timingSafeEqual(expected, receivedBuffer);
}
