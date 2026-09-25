import { SignJWT, jwtVerify } from 'jose';
import { requireEnv } from './config';

// Kept as "token" so sessions issued by the previous version stay valid.
export const SESSION_COOKIE = 'token';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = {
  userId: string;
  email: string;
};

function secretKey() {
  return new TextEncoder().encode(requireEnv('JWT_SECRETKEY'));
}

export async function createSessionToken({ userId, email }: Session) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const key = secretKey();
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    // Tokens from the previous version stored the user id under `id`.
    const userId = payload.sub ?? (typeof payload.id === 'string' ? payload.id : undefined);
    if (!userId || typeof payload.email !== 'string') return null;
    return { userId, email: payload.email };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
};
