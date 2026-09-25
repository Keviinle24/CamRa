import type { Metadata } from 'next';
import { isValidObjectId } from 'mongoose';
import { redirect } from 'next/navigation';
import ChatApp from '@/components/chat/ChatApp';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/user';

export const metadata: Metadata = { title: 'Chat', robots: { index: false } };

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/chat');

  await connectToDatabase();
  const user = isValidObjectId(session.userId)
    ? await User.findById(session.userId, { email: 1, university: 1, verified: 1 }).lean()
    : null;

  // The session outlived the account (deleted, or never verified): clear the cookie.
  if (!user?.verified) redirect('/api/auth/logout');

  return <ChatApp user={{ email: user.email, university: user.university }} />;
}
