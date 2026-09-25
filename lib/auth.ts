import 'server-only';
import { cookies } from 'next/headers';
import { HttpError } from './http';
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
  type Session,
} from './session';

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new HttpError(401, 'Please log in to continue.');
  return session;
}

export async function startSession(session: Session) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(session), sessionCookieOptions);
}

export async function endSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
}
