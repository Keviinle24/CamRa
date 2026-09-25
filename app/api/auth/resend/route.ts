import { connectToDatabase } from '@/lib/db';
import { HttpError, clientIp, enforceRateLimit, handler, readJson } from '@/lib/http';
import { assertResendCooldown, deliverVerificationEmail, findUserByEmail, newEmailToken } from '@/lib/users';
import { isValidEmail, normalizeEmail } from '@/lib/validation';
import { User } from '@/models/user';

export const POST = handler(async (request: Request) => {
  enforceRateLimit(`resend:${clientIp(request)}`, 10, 60 * 60 * 1000);

  const body = await readJson(request);
  const email = normalizeEmail(String(body.email ?? ''));
  if (!isValidEmail(email)) throw new HttpError(400, 'Enter a valid email address.');

  await connectToDatabase();
  const user = await findUserByEmail(email);
  if (!user) {
    throw new HttpError(404, "We couldn't find an account with that email. Sign up first.", { code: 'not_found' });
  }
  if (user.verified) {
    throw new HttpError(409, 'This email is already verified. Log in instead.', { code: 'verified' });
  }

  assertResendCooldown(user.emailToken);
  const emailToken = newEmailToken();
  await User.updateOne({ _id: user._id }, { $set: { emailToken } });
  const delivery = await deliverVerificationEmail(request, user, emailToken);
  return Response.json({ ok: true, delivery });
});
