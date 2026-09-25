'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import LegalLinks from '@/components/legal/LegalLinks';
import FormAlert from '@/components/ui/FormAlert';
import { api, errorMessage } from '@/lib/api-client';
import { universityForEmail } from '@/lib/universities';
import { PASSWORD_MIN_LENGTH, normalizeEmail, registrationError } from '@/lib/validation';
import { AuthHeading } from './AuthShell';
import CheckInbox, { type Delivery } from './CheckInbox';
import PasswordField from './PasswordField';

function UniversityHint({ email }: { email: string }) {
  const university = universityForEmail(email);
  const domain = email.split('@')[1] ?? '';

  if (university) {
    return (
      <span className="text-success">
        <i className="bi bi-patch-check-fill me-1" aria-hidden />
        {university.name}
      </span>
    );
  }
  if (domain.includes('.') && domain.split('.').pop()!.length >= 2) {
    return (
      <span className="text-warning">
        <i className="bi bi-info-circle me-1" aria-hidden />
        We don&rsquo;t support this school yet.
      </span>
    );
  }
  return <>Use your university email address.</>;
}

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // `id` changes on every failed attempt so a repeated error visibly re-appears.
  const [error, setError] = useState<{ text: string; id: number } | null>(null);
  const fail = (text: string) => setError({ text, id: Date.now() });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<{ email: string; delivery: Delivery } | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const invalid = registrationError(normalizeEmail(email), password);
    if (invalid) {
      fail(invalid);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      setSent(await api<{ email: string; delivery: Delivery }>('/api/auth/register', { body: { email, password } }));
    } catch (err) {
      fail(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return <CheckInbox email={sent.email} delivery={sent.delivery} onChangeEmail={() => setSent(null)} />;
  }

  return (
    <>
      <AuthHeading title="Create your account" subtitle="Meet students from universities around the world." />
      <form onSubmit={onSubmit} noValidate>
        {error && <FormAlert key={error.id}>{error.text}</FormAlert>}
        <div className="mb-3">
          <label htmlFor="register-email" className="form-label">
            College email
          </label>
          <input
            id="register-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="you@university.edu"
            aria-describedby="register-email-hint"
            required
          />
          <div id="register-email-hint" className="form-text" aria-live="polite">
            <UniversityHint email={email.trim()} />
          </div>
        </div>
        <PasswordField
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
        />
        <button type="submit" className="btn btn-gradient btn-lg w-100 mt-2" disabled={submitting}>
          {submitting && <span className="spinner-border spinner-border-sm" aria-hidden />}
          Create account
        </button>
      </form>
      <p className="text-center text-body-secondary mt-4 mb-4">
        Already have an account?{' '}
        <Link href="/login" className="link-info fw-semibold">
          Log in
        </Link>
      </p>
      <LegalLinks action="signing up" />
    </>
  );
}
