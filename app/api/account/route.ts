import { endSession, requireSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { handler } from '@/lib/http';
import { removeUserFromRooms } from '@/lib/rooms';
import { User } from '@/models/user';

export const DELETE = handler(async () => {
  const session = await requireSession();
  await connectToDatabase();
  await Promise.all([User.deleteOne({ _id: session.userId }), removeUserFromRooms(session.userId)]);
  await endSession();
  return Response.json({ ok: true });
});
