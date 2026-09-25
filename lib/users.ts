import 'server-only';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Types } from 'mongoose';
import { User } from '@/models/user';
import { sendVerificationEmail } from './email';
import { HttpError } from './http';

const EMAIL_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const BCRYPT_ROUNDS = 12;

export type EmailToken = { token: string; createdAt: Date; expiresAt: Date };

// Accounts created by the previous version stored snake_case token dates.
type StoredEmailToken = Partial<EmailToken> & { created_at?: Date; expired_at?: Date };

export function newEmailToken(): EmailToken {
  const now = Date.now();
  return {
    token: randomBytes(32).toString('hex'),
    createdAt: new Date(now),
    expiresAt: new Date(now + EMAIL_TOKEN_TTL_MS),
  };
}

export function emailTokenExpiry(stored: StoredEmailToken | null | undefined) {
  if (!stored) return 0;
  if (stored.expiresAt) return new Date(stored.expiresAt).getTime();
  const issued = stored.created_at ?? stored.expired_at;
  return issued ? new Date(issued).getTime() + EMAIL_TOKEN_TTL_MS : 0;
}

export function assertResendCooldown(stored: StoredEmailToken | null | undefined) {
  const issued = stored?.createdAt ?? stored?.created_at;
  if (!issued) return;
  const wait = new Date(issued).getTime() + RESEND_COOLDOWN_MS - Date.now();
  if (wait > 0) {
    const retryAfter = Math.ceil(wait / 1000);
    throw new HttpError(429, `We just sent you an email. You can request another in ${retryAfter}s.`, {
      code: 'cooldown',
      retryAfter,
    });
  }
}

/**
 * Looks a user up by normalised (lower-case) email. Falls back to a
 * case-insensitive match for accounts created before emails were normalised.
 */
export async function findUserByEmail(email: string, { withPassword = false } = {}) {
  const exact = User.findOne({ email });
  const user = await (withPassword ? exact.select('+password') : exact);
  if (user) return user;
  const loose = User.findOne({ email }).collation({ locale: 'en', strength: 2 });
  return withPassword ? loose.select('+password') : loose;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

let dummyHash: Promise<string> | undefined;

/** Compares against a dummy hash when there is no user, so timing doesn't reveal which emails exist. */
export async function passwordMatches(password: string, hash: string | undefined) {
  if (hash) return bcrypt.compare(password, hash);
  dummyHash ??= bcrypt.hash(randomBytes(16).toString('hex'), BCRYPT_ROUNDS);
  await bcrypt.compare(password, await dummyHash);
  return false;
}

function verificationUrl(request: Request, token: string) {
  const base = process.env.APP_URL?.replace(/\/+$/, '') || new URL(request.url).origin;
  return `${base}/activate/${token}`;
}

/** Emails a verification link. If sending fails, the resend cooldown is cleared so the user can retry. */
export async function deliverVerificationEmail(
  request: Request,
  user: { _id: Types.ObjectId; email: string },
  emailToken: EmailToken,
) {
  try {
    return await sendVerificationEmail(user.email, verificationUrl(request, emailToken.token));
  } catch (error) {
    await User.updateOne({ _id: user._id }, { $set: { 'emailToken.createdAt': new Date(0) } });
    throw error;
  }
}
