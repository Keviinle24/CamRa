'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ApiError, api, errorMessage } from '@/lib/api-client';
import CheckInbox from './CheckInbox';

type State =
  | { kind: 'verifying' }
  | { kind: 'success' }
  | { kind: 'expired'; email: string }
  | { kind: 'error'; message: string };

export default function ActivateAccount({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: 'verifying' });
  // Activation is one-shot; guard against React re-running the effect in development.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    api('/api/auth/activate', { body: { token } })
      .then(() => {
        setState({ kind: 'success' });
        setTimeout(() => {
          router.replace('/chat');
          router.refresh();
        }, 1500);
      })
      .catch((error) => {
        if (error instanceof ApiError && error.code === 'expired' && typeof error.data?.email === 'string') {
          setState({ kind: 'expired', email: error.data.email });
        } else {
          setState({ kind: 'error', message: errorMessage(error) });
        }
      });
  }, [token, router]);

  if (state.kind === 'expired') {
    return (
      <>
        <div className="alert alert-warning small mb-4" role="alert">
          That link has expired. Send yourself a new one below.
        </div>
        <CheckInbox email={state.email} justSent={false} />
      </>
    );
  }

  return (
    <div className="text-center" aria-live="polite">
      {state.kind === 'verifying' && (
        <>
          <div className="spinner-border text-info mb-4" style={{ width: '3rem', height: '3rem' }} aria-hidden />
          <h1 className="h3 fw-bold">
            Verifying your <span className="text-gradient">email</span>…
          </h1>
        </>
      )}
      {state.kind === 'success' && (
        <>
          <i className="bi bi-patch-check-fill text-success d-block mb-3" style={{ fontSize: '3.5rem' }} aria-hidden />
          <h1 className="h3 fw-bold mb-2">You&rsquo;re verified!</h1>
          <p className="text-body-secondary mb-4">Taking you to CamRa…</p>
          <Link href="/chat" className="btn btn-gradient">
            Start chatting <i className="bi bi-arrow-right" aria-hidden />
          </Link>
        </>
      )}
      {state.kind === 'error' && (
        <>
          <i className="bi bi-x-octagon text-danger d-block mb-3" style={{ fontSize: '3.5rem' }} aria-hidden />
          <h1 className="h3 fw-bold mb-2">We couldn&rsquo;t verify that link</h1>
          <p className="text-body-secondary mb-4">{state.message}</p>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Link href="/login" className="btn btn-gradient">
              Log in
            </Link>
            <Link href="/register" className="btn btn-glass">
              Sign up again
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
