'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { ChatMessage, ChatStatus } from '@/hooks/useVideoChat';
import { MESSAGE_MAX_LENGTH } from '@/lib/validation';
import styles from './Chat.module.scss';

const EmojiPickerPopover = dynamic(() => import('./EmojiPickerPopover'), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-center">
      <span className="spinner-border spinner-border-sm" aria-hidden />
    </div>
  ),
});

function MessageList({ messages, status }: { messages: ChatMessage[]; status: ChatStatus }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div ref={listRef} className={`${styles.messages} scroll-thin`} role="log" aria-live="polite" aria-label="Chat messages">
      {messages.length === 0 && (
        <div className={styles.messagesEmpty}>
          <i className="bi bi-chat-dots" aria-hidden />
          <p className="mb-0">
            {status === 'connected' ? 'Say hi 👋' : 'Messages will show up here once someone joins.'}
          </p>
        </div>
      )}
      {messages.map((message) => (
        <div key={message.id} className={`${styles.message} ${styles[message.from]}`}>
          {message.from === 'stranger' && <span className="visually-hidden">Stranger: </span>}
          {message.from === 'me' && <span className="visually-hidden">You: </span>}
          {message.text}
        </div>
      ))}
    </div>
  );
}

function Composer({ enabled, onSend }: { enabled: boolean; onSend: (text: string) => Promise<boolean> }) {
  const [text, setText] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !pickerRef.current?.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [pickerOpen]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (await onSend(text)) setText('');
    inputRef.current?.focus();
  }

  return (
    <form className={styles.composer} onSubmit={submit}>
      <div ref={pickerRef} className="position-relative d-none d-md-block">
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setPickerOpen((open) => !open)}
          aria-label="Add emoji"
          aria-expanded={pickerOpen}
          disabled={!enabled}
        >
          <i className="bi bi-emoji-smile" aria-hidden />
        </button>
        {pickerOpen && (
          <div className={styles.emojiPopover}>
            <EmojiPickerPopover onPick={(emoji) => setText((current) => (current + emoji).slice(0, MESSAGE_MAX_LENGTH))} />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        className={`form-control ${styles.composerInput}`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={MESSAGE_MAX_LENGTH}
        placeholder={enabled ? 'Type a message…' : 'Chat opens when someone joins…'}
        aria-label="Message"
        disabled={!enabled}
        enterKeyHint="send"
      />
      <button type="submit" className={`btn btn-gradient ${styles.sendButton}`} disabled={!enabled || !text.trim()} aria-label="Send message">
        <i className="bi bi-send-fill" aria-hidden />
      </button>
    </form>
  );
}

type ChatPanelProps = {
  messages: ChatMessage[];
  status: ChatStatus;
  onSend: (text: string) => Promise<boolean>;
  children: React.ReactNode; // call controls
};

export default function ChatPanel({ messages, status, onSend, children }: ChatPanelProps) {
  return (
    <section className={`glass-card ${styles.chatPanel}`} aria-label="Chat">
      <MessageList messages={messages} status={status} />
      <Composer enabled={status === 'connected'} onSend={onSend} />
      {children}
    </section>
  );
}
