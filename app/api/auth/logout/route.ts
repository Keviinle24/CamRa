import { NextResponse } from 'next/server';
import { endSession } from '@/lib/auth';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';

export async function POST() {
  await endSession();
  return Response.json({ ok: true });
}

// Used by server components that find a stale session (e.g. a deleted
// account): they can't modify cookies themselves, so they redirect here.
export function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
