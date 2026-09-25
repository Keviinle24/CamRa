import 'server-only';
import { Types, isValidObjectId } from 'mongoose';
import { Room } from '@/models/Room';
import { MAX_SKIPPED_ROOMS, STALE_MEMBER_MS } from './chat-config';

// Matchmaking model
// -----------------
// A room holds at most two members. Joining atomically claims the oldest
// "waiting" room (preferring one whose member shares an interest), or creates
// a new waiting room. Members send heartbeats; anyone silent for
// STALE_MEMBER_MS is dropped, so abandoned rooms never trap new users.

type RoomRef = { roomId: string; callId: string; userId: string };

/** Room ids a client recently left and doesn't want to be matched back into. */
export function parseSkipList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((id): id is string => typeof id === 'string' && isValidObjectId(id))
    .slice(0, MAX_SKIPPED_ROOMS);
}

function toObjectIds(ids: string[]) {
  return ids.filter((id) => isValidObjectId(id)).map((id) => new Types.ObjectId(id));
}

/** Filter for rooms a user may join: waiting, alive, someone else's, not skipped. */
function openRoomFilter(user: Types.ObjectId, skip: string[], now: Date) {
  return {
    status: 'waiting' as const,
    lastSeenAt: { $gte: new Date(now.getTime() - STALE_MEMBER_MS) },
    members: { $size: 1 },
    'members.user': { $ne: user },
    _id: { $nin: toObjectIds(skip) },
  };
}

export async function leaveRoom({ roomId, callId, userId }: RoomRef) {
  if (!isValidObjectId(roomId)) return;
  const room = await Room.findOneAndUpdate(
    { _id: roomId, members: { $elemMatch: { callId, user: userId } } },
    { $pull: { members: { callId } }, $set: { status: 'waiting' } },
    { returnDocument: 'after' },
  );
  if (room && room.members.length === 0) {
    await Room.deleteOne({ _id: room._id, members: { $size: 0 } });
  }
}

export async function joinRoom({
  callId,
  userId,
  interests,
  skip,
}: {
  callId: string;
  userId: string;
  interests: string[];
  skip: string[];
}) {
  // A call can only be in one room at a time (covers a missed "leave").
  const previous = await Room.find({ members: { $elemMatch: { callId, user: userId } } }, { _id: 1 }).lean();
  await Promise.all(previous.map((room) => leaveRoom({ roomId: room._id.toString(), callId, userId })));

  const now = new Date();
  const user = new Types.ObjectId(userId);
  const member = { callId, user, interests, lastSeenAt: now };
  const open = openRoomFilter(user, skip, now);
  const claim = { $set: { status: 'chatting' as const, lastSeenAt: now }, $push: { members: member } };
  const options = { sort: { createdAt: 1 as const }, returnDocument: 'after' as const };

  let room =
    interests.length > 0
      ? await Room.findOneAndUpdate({ ...open, 'members.interests': { $in: interests } }, claim, options)
      : null;
  room ??= await Room.findOneAndUpdate(open, claim, options);
  room ??= await Room.create({ status: 'waiting', members: [member], lastSeenAt: now });
  return room;
}

export async function heartbeat({ roomId, callId, userId, skip }: RoomRef & { skip: string[] }) {
  if (!isValidObjectId(roomId)) return null;
  const now = new Date();

  let room = await Room.findOneAndUpdate(
    { _id: roomId, members: { $elemMatch: { callId, user: userId } } },
    { $set: { 'members.$.lastSeenAt': now, lastSeenAt: now } },
    { returnDocument: 'after' },
  );
  if (!room) return null;

  // Drop a partner who stopped sending heartbeats (closed tab, lost connection).
  const cutoff = new Date(now.getTime() - STALE_MEMBER_MS);
  if (room.members.some((member) => member.lastSeenAt < cutoff)) {
    room =
      (await Room.findOneAndUpdate(
        { _id: room._id },
        { $pull: { members: { lastSeenAt: { $lt: cutoff } } }, $set: { status: 'waiting' } },
        { returnDocument: 'after' },
      )) ?? room;
  }

  // Two people waiting in separate rooms should find each other: the newer
  // room's member moves to the older room.
  let rematch = false;
  if (room.status === 'waiting' && room.members.length === 1) {
    const open = openRoomFilter(new Types.ObjectId(userId), skip, now);
    const older = await Room.exists({
      ...open,
      _id: { ...open._id, $ne: room._id },
      createdAt: { $lt: room.createdAt },
    });
    rematch = Boolean(older);
  }

  return { status: room.status, rematch };
}

export async function removeUserFromRooms(userId: string) {
  const user = new Types.ObjectId(userId);
  await Room.updateMany({ 'members.user': user }, { $pull: { members: { user } }, $set: { status: 'waiting' } });
  await Room.deleteMany({ members: { $size: 0 } });
}
