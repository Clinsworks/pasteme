import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { HttpError } from "./errors.js";

export const SESSION_COOKIE = "pasteme_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function setSessionCookie(response, userId) {
  const token = jwt.sign({ sub: userId }, env.AUTH_TOKEN_SECRET, {
    expiresIn: "7d",
    issuer: "pasteme-api",
    audience: "pasteme-web",
  });

  response.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS,
  });
}

export function clearSessionCookie(response) {
  response.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
}

export async function authenticate(request, _response, next) {
  try {
    const token = request.cookies?.[SESSION_COOKIE];
    if (!token) throw new HttpError(401, "Please log in to continue.");

    const claims = jwt.verify(token, env.AUTH_TOKEN_SECRET, {
      issuer: "pasteme-api",
      audience: "pasteme-web",
    });
    const user = await User.findById(claims.sub);
    if (!user) throw new HttpError(401, "Please log in to continue.");

    request.user = user;
    next();
  } catch (error) {
    next(error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError
      ? new HttpError(401, "Please log in to continue.")
      : error);
  }
}
