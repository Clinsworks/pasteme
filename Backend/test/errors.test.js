import assert from "node:assert/strict";
import test from "node:test";
import { errorHandler } from "../src/middleware/errors.js";

test("Open Payments errors log provider details and return a safe gateway message", () => {
  const logged = [];
  const originalError = console.error;
  const response = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  console.error = (...args) => logged.push(args);

  try {
    errorHandler({
      name: "OpenPaymentsClientError",
      status: 401,
      code: "unauthorized",
      description: "The wallet rejected the client signature.",
    }, {}, response, () => {});
  } finally {
    console.error = originalError;
  }

  assert.equal(response.statusCode, 502);
  assert.equal(response.body.message.includes("client signature"), false);
  assert.deepEqual(logged[0][1], {
    status: 401,
    code: "unauthorized",
    description: "The wallet rejected the client signature.",
  });
});
