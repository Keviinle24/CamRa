'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import LegalLinks from '@/components/legal/LegalLinks';
import FormAlert from '@/components/ui/FormAlert';
import { ApiError, api, errorMessage } from '@/lib/api-client';
import { AuthHeading } from './AuthShell';
import CheckInbox from './CheckInbox';
import PasswordField from './PasswordField';

/** `devLogin` shows a one-click demo sign-in; only true under `npm run dev`. */
export default function LoginForm({ next, devLogin = false }: { next: string; devLogin?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // `id` changes on every failed attempt so a repeated error visibly re-appears.
  const [error, setError] = useState<{ text: string; id: number } | null>(null);
  const fail = (text: string) => setError({ text, id: Date.now() });
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api('/api/auth/login', { body: { email, password } });
      router.replace(next);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'unverified') {
        setUnverifiedEmail(typeof err.data?.email === 'string' ? err.data.email : email);
      } else {
        fail(errorMessage(err));
      }
      setSubmitting(false);
    }
  }

  if (unverifiedEmail) {
    return (
      <>
        <div className="alert alert-warning small mb-4" role="alert">
          <i className="bi bi-exclamation-circle me-2" aria-hidden />
          Verify your email address before logging in.
        </div>
        <CheckInbox email={unverifiedEmail} justSent={false} onChangeEmail={() => setUnverifiedEmail(null)} />
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Log in to jump back into a chat." />
      <form onSubmit={onSubmit} noValidate>
        {error && <FormAlert key={error.id}>{error.text}</FormAlert>}
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">
            College email
          </label>
          <input
            id="login-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="you@university.edu"
            required
          />
        </div>
        <PasswordField value={password} onChange={setPassword} autoComplete="current-password" />
        <button type="submit" className="btn btn-gradient btn-lg w-100 mt-2" disabled={submitting}>
          {submitting && <span className="spinner-border spinner-border-sm" aria-hidden />}
          Log in
        </button>
      </form>
      {devLogin && (
        <a href={`/api/dev/login?next=${encodeURIComponent(next)}`} className="btn btn-glass w-100 mt-3">
          <i className="bi bi-lightning-charge" aria-hidden /> Skip login (dev only)
        </a>
      )}
      <p className="text-center text-body-secondary mt-4 mb-4">
        New to CamRa?{' '}
        <Link href="/register" className="link-info fw-semibold">
          Create an account
        </Link>
      </p>
      <LegalLinks action="logging in" />
    </>
  );
}
