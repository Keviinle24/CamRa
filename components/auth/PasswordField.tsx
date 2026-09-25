'use client';

import { useId, useState } from 'react';

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  label?: string;
  hint?: string;
};

export default function PasswordField({ value, onChange, autoComplete, label = 'Password', hint }: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="input-group">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="form-control"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-describedby={hint ? `${id}-hint` : undefined}
          required
        />
        <button
          type="button"
          className="btn btn-glass px-3"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          style={{ borderRadius: '0 var(--bs-border-radius) var(--bs-border-radius) 0' }}
        >
          <i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden />
        </button>
      </div>
      {hint && (
        <div id={`${id}-hint`} className="form-text">
          {hint}
        </div>
      )}
    </div>
  );
}
