import { issueTokens, isValidCallId } from '@/lib/agora';
import { requireSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { HttpError, enforceRateLimit, handler, readJson } from '@/lib/http';
import { heartbeat, parseSkipList } from '@/lib/rooms';

/** Heartbeat: keeps the caller's membership alive and tells them whether to move rooms. */
export const PATCH = handler(async (request: Request, ctx: RouteContext<'/api/rooms/[roomId]'>) => {
  const session = await requireSession();
  enforceRateLimit(`heartbeat:${session.userId}`, 60, 60 * 1000);

  const { roomId } = await ctx.params;
  const body = await readJson(request);
  if (!isValidCallId(session.userId, body.callId)) throw new HttpError(400, 'Invalid call.');

  await connectToDatabase();
  const result = await heartbeat({
    roomId,
    callId: body.callId,
    userId: session.userId,
    skip: parseSkipList(body.skip),
  });
  if (!result) throw new HttpError(404, 'This chat has ended.', { code: 'room_gone' });

  // Clients ask for fresh tokens shortly before their current ones expire.
  const tokens = body.renew === true ? issueTokens(roomId, body.callId) : undefined;
  return Response.json({ ...result, tokens });
});
