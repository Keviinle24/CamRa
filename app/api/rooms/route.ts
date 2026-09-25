import { agoraAppId, issueCallId, issueTokens, isValidCallId } from '@/lib/agora';
import { requireSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { HttpError, enforceRateLimit, handler, readJson } from '@/lib/http';
import { joinRoom, parseSkipList } from '@/lib/rooms';
import { normalizeInterests } from '@/lib/validation';
import { User } from '@/models/user';

/** Finds a partner (or opens a waiting room) and returns the Agora credentials for it. */
export const POST = handler(async (request: Request) => {
  const session = await requireSession();
  enforceRateLimit(`join:${session.userId}`, 30, 60 * 1000);

  const appId = agoraAppId();
  const body = await readJson(request);
  const callId = isValidCallId(session.userId, body.callId) ? body.callId : issueCallId(session.userId);

  await connectToDatabase();
  if (!(await User.exists({ _id: session.userId, verified: true }))) {
    throw new HttpError(401, 'Your session has expired. Please log in again.');
  }

  const room = await joinRoom({
    callId,
    userId: session.userId,
    interests: normalizeInterests(body.interests),
    skip: parseSkipList(body.skip),
  });
  const roomId = room._id.toString();

  return Response.json({ appId, callId, roomId, status: room.status, ...issueTokens(roomId, callId) });
});
