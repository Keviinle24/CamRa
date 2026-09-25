import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const emailTokenSchema = new Schema(
  {
    // Same index as the previous schema (emailToken.token_1, unique) so existing
    // databases don't need a migration. The token is rotated, never removed.
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 254 },
    password: { type: String, required: true, select: false },
    verified: { type: Boolean, required: true, default: false },
    university: { type: String, required: true },
    emailToken: { type: emailTokenSchema, required: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User: Model<UserDocument> = models.User ?? model('User', userSchema, 'users');
