import { isValidCallId } from '@/lib/agora';
import { requireSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { handler, readJson } from '@/lib/http';
import { leaveRoom } from '@/lib/rooms';

// POST (not DELETE) so it also works with navigator.sendBeacon when the tab closes.
export const POST = handler(async (request: Request, ctx: RouteContext<'/api/rooms/[roomId]/leave'>) => {
  const session = await requireSession();
  const { roomId } = await ctx.params;
  const body = await readJson(request);

  if (isValidCallId(session.userId, body.callId)) {
    await connectToDatabase();
    await leaveRoom({ roomId, callId: body.callId, userId: session.userId });
  }
  return new Response(null, { status: 204 });
});
