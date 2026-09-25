'use client';

import { useState, type KeyboardEvent } from 'react';
import { isUniversityTag } from '@/lib/universities';
import { INTEREST_MAX_LENGTH, MAX_INTERESTS, normalizeInterest } from '@/lib/validation';
import styles from './Chat.module.scss';

type InterestFilterProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export default function InterestFilter({ value, onChange }: InterestFilterProps) {
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const full = value.length >= MAX_INTERESTS;

  function add(raw: string) {
    const tag = normalizeInterest(raw);
    if (!tag) return;
    if (full) return setHint(`You can add up to ${MAX_INTERESTS} interests.`);
    if (value.includes(tag)) return setHint(`“${tag}” is already on your list.`);
    onChange([...value, tag]);
    setDraft('');
    setHint(null);
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
    setHint(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add(draft);
    } else if (event.key === 'Backspace' && !draft && value.length > 0) {
      remove(value[value.length - 1]);
    }
  }

  return (
    <div>
      <div className={styles.filterBox}>
        {value.map((tag) => {
          const university = isUniversityTag(tag);
          return (
            <span key={tag} className={`${styles.tag} ${university ? styles.tagUniversity : ''}`}>
              {university && <i className="bi bi-mortarboard-fill" aria-hidden />}
              {tag}
              <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
                <i className="bi bi-x" aria-hidden />
              </button>
            </span>
          );
        })}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          maxLength={INTEREST_MAX_LENGTH}
          placeholder={full ? 'Interest limit reached' : value.length ? 'Add another…' : 'e.g. music, soccer, NEU'}
          aria-label="Add an interest"
          aria-describedby="interest-hint"
          disabled={full}
          enterKeyHint="done"
        />
        <button type="button" className="btn btn-sm btn-glass" onClick={() => add(draft)} disabled={!draft.trim() || full}>
          Add
        </button>
      </div>
      <p id="interest-hint" className={`form-text mt-2 mb-0 ${hint ? 'text-warning' : ''}`} aria-live="polite">
        {hint ?? `Press Enter to add · ${value.length}/${MAX_INTERESTS}`}
      </p>
    </div>
  );
}
