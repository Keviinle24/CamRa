'use client';

import EmojiPicker, { Theme } from 'emoji-picker-react';

// Loaded on demand (next/dynamic) so the emoji data isn't in the initial bundle.
export default function EmojiPickerPopover({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <EmojiPicker
      theme={Theme.DARK}
      onEmojiClick={(data) => onPick(data.emoji)}
      lazyLoadEmojis
      width={320}
      height={380}
      previewConfig={{ showPreview: false }}
    />
  );
}
