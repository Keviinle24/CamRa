import { startSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { HttpError, clientIp, enforceRateLimit, handler, readJson } from '@/lib/http';
import { findUserByEmail, passwordMatches } from '@/lib/users';
import { normalizeEmail } from '@/lib/validation';

export const POST = handler(async (request: Request) => {
  enforceRateLimit(`login:${clientIp(request)}`, 20, 5 * 60 * 1000);

  const body = await readJson(request);
  const email = normalizeEmail(String(body.email ?? ''));
  const password = String(body.password ?? '');
  if (!email || !password) throw new HttpError(400, 'Enter your email and password.');

  await connectToDatabase();
  const user = await findUserByEmail(email, { withPassword: true });
  const valid = await passwordMatches(password, user?.password);

  if (!user || !valid) throw new HttpError(401, 'Incorrect email or password.');
  if (!user.verified) {
    throw new HttpError(403, 'Please verify your email before logging in.', {
      code: 'unverified',
      details: { email: user.email },
    });
  }

  await startSession({ userId: user._id.toString(), email: user.email });
  return Response.json({ ok: true });
});
