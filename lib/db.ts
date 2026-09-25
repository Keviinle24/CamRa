import 'server-only';
import mongoose from 'mongoose';
import { SetupError, requireEnv } from './config';

type ConnectionCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse one connection across hot reloads in development and across
// invocations of the same server instance in production.
const globalForMongoose = globalThis as typeof globalThis & { mongooseCache?: ConnectionCache };
const cache = (globalForMongoose.mongooseCache ??= { conn: null, promise: null });

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;

  const uri =
    process.env.MONGODB_URI ||
    (process.env.NODE_ENV === 'development'
      ? await (await import('./dev-database')).startDevDatabase()
      : requireEnv('MONGODB_URI'));

  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10_000,
  });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw new SetupError(
      `Couldn't connect to MongoDB (${(error as Error).message}). Check MONGODB_URI and, on MongoDB Atlas, that your IP address is allowed under Network Access.`,
      "We can't reach the database right now. Please try again in a moment.",
    );
  }
  return cache.conn;
}
