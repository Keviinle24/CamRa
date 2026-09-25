import type { Types } from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { HttpError, clientIp, enforceRateLimit, handler, readJson } from '@/lib/http';
import { universityForEmail } from '@/lib/universities';
import {
  assertResendCooldown,
  deliverVerificationEmail,
  findUserByEmail,
  hashPassword,
  newEmailToken,
} from '@/lib/users';
import { normalizeEmail, registrationError } from '@/lib/validation';
import { User } from '@/models/user';

const ALREADY_REGISTERED = 'An account with this email already exists. Log in instead.';

export const POST = handler(async (request: Request) => {
  enforceRateLimit(`register:${clientIp(request)}`, 10, 60 * 60 * 1000);

  const body = await readJson(request);
  const email = normalizeEmail(String(body.email ?? ''));
  const password = String(body.password ?? '');

  const invalid = registrationError(email, password);
  if (invalid) throw new HttpError(400, invalid);
  const university = universityForEmail(email)!.name;

  await connectToDatabase();
  const existing = await findUserByEmail(email);
  if (existing?.verified) throw new HttpError(409, ALREADY_REGISTERED, { code: 'exists' });

  const passwordHash = await hashPassword(password);
  const emailToken = newEmailToken();
  let user: { _id: Types.ObjectId; email: string };

  if (existing) {
    // Registering again before verifying: update the details and send a fresh link.
    assertResendCooldown(existing.emailToken);
    await User.updateOne({ _id: existing._id }, { $set: { password: passwordHash, university, emailToken } });
    user = existing;
  } else {
    try {
      user = await User.create({ email, password: passwordHash, university, emailToken });
    } catch (error) {
      if ((error as { code?: number }).code === 11000) {
        throw new HttpError(409, ALREADY_REGISTERED, { code: 'exists' });
      }
      throw error;
    }
  }

  const delivery = await deliverVerificationEmail(request, user, emailToken);
  return Response.json({ ok: true, email: user.email, delivery }, { status: 201 });
});
