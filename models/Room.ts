import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const memberSchema = new Schema(
  {
    callId: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    interests: { type: [String], default: [] },
    lastSeenAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const roomSchema = new Schema(
  {
    status: { type: String, enum: ['waiting', 'chatting'], required: true },
    members: { type: [memberSchema], default: [] },
    // Refreshed by every member heartbeat. Rooms nobody has touched for ten
    // minutes are removed automatically by MongoDB.
    lastSeenAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

roomSchema.index({ status: 1, createdAt: 1 });
roomSchema.index({ lastSeenAt: 1 }, { expireAfterSeconds: 60 * 10 });

export type RoomDocument = InferSchemaType<typeof roomSchema>;

export const Room: Model<RoomDocument> = models.Room ?? model('Room', roomSchema, 'rooms');
