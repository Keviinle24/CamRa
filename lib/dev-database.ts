import 'server-only';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

// DEVELOPMENT ONLY: when MONGODB_URI isn't set, `npm run dev` runs a local
// MongoDB instead. Data is kept in .dev-db/ so it survives restarts.

const globalForDevDb = globalThis as typeof globalThis & { devDatabaseUri?: Promise<string> };

export function startDevDatabase() {
  globalForDevDb.devDatabaseUri ??= (async () => {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const dbPath = path.join(process.cwd(), '.dev-db');
    await mkdir(dbPath, { recursive: true });
    const server = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: 'wiredTiger' } });
    console.info('[db] MONGODB_URI is not set: using a local development database (data in .dev-db/).');
    return server.getUri('camra');
  })().catch((error) => {
    globalForDevDb.devDatabaseUri = undefined;
    throw error;
  });
  return globalForDevDb.devDatabaseUri;
}
