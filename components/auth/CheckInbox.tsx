'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiError, api, errorMessage } from '@/lib/api-client';
import { SOCIAL } from '@/lib/site';
import FormAlert from '@/components/ui/FormAlert';

const COOLDOWN_SECONDS = 60;

/** How the server delivered the link: by email, or printed to its console (development). */
export type Delivery = 'email' | 'console';

type CheckInboxProps = {
  email: string;
  /** Start with the resend button on cooldown (an email was just sent). */
  justSent?: boolean;
  delivery?: Delivery;
  onChangeEmail?: () => void;
};

export default function CheckInbox({ email, justSent = true, delivery: initialDelivery, onChangeEmail }: CheckInboxProps) {
  const [delivery, setDelivery] = useState(initialDelivery);
  const [cooldown, setCooldown] = useState(justSent ? COOLDOWN_SECONDS : 0);
  const [status, setStatus] = useState<{ tone: 'success' | 'danger'; text: string; id: number } | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function resend() {
    setSending(true);
    setStatus(null);
    try {
      const result = await api<{ delivery: Delivery }>('/api/auth/resend', { body: { email } });
      setDelivery(result.delivery);
      setStatus({ tone: 'success', text: 'A new verification link is on its way.', id: Date.now() });
      setCooldown(COOLDOWN_SECONDS);
    } catch (error) {
      if (error instanceof ApiError && typeof error.data?.retryAfter === 'number') setCooldown(error.data.retryAfter);
      setStatus({ tone: 'danger', text: errorMessage(error), id: Date.now() });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="text-center">
      <div
        className="d-inline-grid rounded-circle mb-4 fs-2"
        style={{ width: 72, height: 72, placeItems: 'center', background: 'var(--camra-gradient)', color: '#100425' }}
        aria-hidden
      >
        <i className="bi bi-envelope-paper-heart" />
      </div>
      <h1 className="h3 fw-bold mb-2">Check your inbox</h1>
      <p className="text-body-secondary mb-4">
        We sent a verification link to <strong className="text-body text-break">{email}</strong>. It can take a few
        minutes to arrive, so check your spam folder too.
      </p>

      {delivery === 'console' && (
        <div className="text-start">
          <FormAlert tone="warning">
            Development mode: no email service is set up yet, so the link was printed in the terminal running{' '}
            <code>npm run dev</code>. Open it from there.
          </FormAlert>
        </div>
      )}

      {status && (
        <div className="text-start">
          <FormAlert key={status.id} tone={status.tone}>
            {status.text}
          </FormAlert>
        </div>
      )}

      <button type="button" className="btn btn-glass w-100 mb-3" onClick={resend} disabled={sending || cooldown > 0}>
        {sending ? (
          <span className="spinner-border spinner-border-sm" aria-hidden />
        ) : (
          <i className="bi bi-arrow-repeat" aria-hidden />
        )}
        {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email'}
      </button>

      <div className="d-flex justify-content-center gap-3 small">
        {onChangeEmail && (
          <button type="button" className="link-button" onClick={onChangeEmail}>
            Use a different email
          </button>
        )}
        <Link href="/login" className="link-info">
          Back to log in
        </Link>
      </div>

      <p className="small text-body-secondary mt-4 mb-0">
        Still nothing? Email <a href={`mailto:${SOCIAL.email}`}>{SOCIAL.email}</a> and we&rsquo;ll help out.
      </p>
    </div>
  );
}
