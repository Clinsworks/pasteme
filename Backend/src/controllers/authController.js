import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { HttpError } from "../middleware/errors.js";
import { clearSessionCookie, setSessionCookie } from "../middleware/authenticate.js";

const passwordSchema = z.string()
  .min(8)
  .max(128)
  .refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Password must not exceed 72 UTF-8 bytes.");

export const signupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string()
    .min(1)
    .max(128)
    .refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Password must not exceed 72 UTF-8 bytes."),
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function signup(request, response) {
  const { name, email, password } = request.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  setSessionCookie(response, user.id);
  response.status(201).json({ user: publicUser(user) });
}

export async function login(request, response) {
  const { email, password } = request.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Email or password is incorrect.");
  }

  setSessionCookie(response, user.id);
  response.json({ user: publicUser(user) });
}

export function logout(_request, response) {
  clearSessionCookie(response);
  response.status(204).end();
}

export function currentUser(request, response) {
  response.json({ user: publicUser(request.user) });
}

export function requestPasswordRecovery(_request, _response) {
  throw new HttpError(503, "Password recovery is unavailable until an email delivery service is configured.");
}
