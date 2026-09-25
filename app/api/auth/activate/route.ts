import { startSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { HttpError, clientIp, enforceRateLimit, handler, readJson } from '@/lib/http';
import { emailTokenExpiry, newEmailToken } from '@/lib/users';
import { User } from '@/models/user';

const INVALID_LINK = 'This verification link is invalid or has already been used.';

export const POST = handler(async (request: Request) => {
  enforceRateLimit(`activate:${clientIp(request)}`, 20, 15 * 60 * 1000);

  const body = await readJson(request);
  const token = typeof body.token === 'string' ? body.token : '';
  if (!/^[a-f0-9]{32,128}$/i.test(token)) throw new HttpError(400, INVALID_LINK, { code: 'invalid' });

  await connectToDatabase();
  const user = await User.findOne({ 'emailToken.token': token }).lean();
  if (!user) throw new HttpError(400, INVALID_LINK, { code: 'invalid' });

  if (emailTokenExpiry(user.emailToken) < Date.now()) {
    throw new HttpError(410, 'This verification link has expired.', {
      code: 'expired',
      details: { email: user.email },
    });
  }

  // Rotate the token (rather than deleting it) so the link can't be reused.
  const rotated = { ...newEmailToken(), expiresAt: new Date() };
  const { modifiedCount } = await User.updateOne(
    { _id: user._id, 'emailToken.token': token },
    { $set: { verified: true, emailToken: rotated } },
  );
  if (modifiedCount === 0) throw new HttpError(400, INVALID_LINK, { code: 'invalid' });

  await startSession({ userId: user._id.toString(), email: user.email });
  return Response.json({ ok: true });
});
