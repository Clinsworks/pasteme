import assert from "node:assert/strict";
import test from "node:test";

process.env.MONGODB_URI ||= "mongodb://127.0.0.1:27017/pasteme-test";
process.env.AUTH_TOKEN_SECRET ||= "test-only-auth-token-secret-at-least-32-characters";

const { loginSchema, signupSchema } = await import("../src/controllers/authController.js");

test("signup and login reject passwords that exceed bcrypt's UTF-8 byte limit", () => {
  const password = "é".repeat(37);

  assert.equal(Buffer.byteLength(password, "utf8"), 74);
  assert.equal(signupSchema.safeParse({
    name: "Example User",
    email: "user@example.com",
    password,
  }).success, false);
  assert.equal(loginSchema.safeParse({
    email: "user@example.com",
    password,
  }).success, false);
});
