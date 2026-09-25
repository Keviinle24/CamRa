import { NextResponse } from 'next/server';
import { safeNextPath } from '@/lib/api-client';
import { connectToDatabase } from '@/lib/db';
import { handler } from '@/lib/http';
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from '@/lib/session';
import { hashPassword, newEmailToken } from '@/lib/users';
import { User } from '@/models/user';

// DEVELOPMENT ONLY: signs you in as a demo student without a password.
// `next build` / `next start` run with NODE_ENV=production, where this route is a 404.
//
//   /api/dev/login            -> demo@northeastern.edu
//   /api/dev/login?user=2     -> demo2@northeastern.edu (use a second browser to test a two-person chat)
//
// Demo accounts can also log in normally with the password "password123".
export const GET = handler(async (request: Request) => {
  if (process.env.NODE_ENV !== 'development') return new Response('Not found', { status: 404 });

  const url = new URL(request.url);
  const n = Math.min(Math.max(Math.trunc(Number(url.searchParams.get('user'))) || 1, 1), 5);
  const email = n === 1 ? 'demo@northeastern.edu' : `demo${n}@northeastern.edu`;

  await connectToDatabase();
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: { verified: true, university: 'Northeastern University' },
      $setOnInsert: { email, password: await hashPassword('password123'), emailToken: newEmailToken() },
    },
    { upsert: true, returnDocument: 'after' },
  );

  const next = safeNextPath(url.searchParams.get('next') ?? undefined);
  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(SESSION_COOKIE, await createSessionToken({ userId: user._id.toString(), email }), sessionCookieOptions);
  return response;
});
