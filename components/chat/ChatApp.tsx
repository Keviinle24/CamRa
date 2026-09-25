'use client';

import { useState } from 'react';
import { useVideoChat } from '@/hooks/useVideoChat';
import CallView from './CallView';
import ChatNavbar from './ChatNavbar';
import Lobby from './Lobby';
import styles from './Chat.module.scss';

export default function ChatApp({ user }: { user: { email: string; university: string } }) {
  const chat = useVideoChat();
  const [interests, setInterests] = useState<string[]>([]);

  return (
    <div className={styles.app}>
      <ChatNavbar user={user} status={chat.status} onLeave={chat.stop} />
      {chat.status === 'idle' ? (
        <Lobby
          interests={interests}
          onInterestsChange={setInterests}
          onStart={() => chat.start(interests)}
          error={chat.error}
          onDismissError={chat.dismissError}
        />
      ) : (
        <CallView chat={chat} />
      )}
    </div>
  );
}
