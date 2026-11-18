export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(error, request, response, _next) {
  if (error?.type === "entity.too.large") {
    return response.status(413).json({ message: "The request body is too large." });
  }
  if (error instanceof SyntaxError && Object.hasOwn(error, "body")) {
    return response.status(400).json({ message: "The request body must be valid JSON." });
  }

  if (error?.name === "ZodError") {
    return response.status(400).json({
      message: error.issues.map((issue) => issue.message).join(" "),
    });
  }

  if (error?.code === 11000) {
    return response.status(409).json({ message: "An account with this email already exists." });
  }

  if (error?.name === "OpenPaymentsClientError") {
    console.error("Open Payments request failed:", {
      status: error.status,
      code: error.code,
      description: error.description,
    });
    return response.status(502).json({
      message: "A wallet provider rejected the request. Check the Backend terminal for its status and description.",
    });
  }

  const status = Number.isInteger(error?.status) ? error.status : 500;
  if (status >= 500) {
    console.error("Request failed:", error);
  }

  return response.status(status).json({
    message: status >= 500 ? "The request could not be completed." : error.message,
  });
}
