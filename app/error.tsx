'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="position-relative min-vh-100 d-grid align-items-center py-5" style={{ isolation: 'isolate' }}>
      <div className="glow-field" aria-hidden />
      <div className="container text-center" style={{ maxWidth: 560 }}>
        <i className="bi bi-lightning-charge text-gradient d-inline-block mb-3" style={{ fontSize: '4rem' }} aria-hidden />
        <h1 className="h2 fw-bold mb-3">Something went wrong on our end</h1>
        <p className="text-body-secondary mb-4">Please try again. If it keeps happening, let us know.</p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button type="button" className="btn btn-gradient btn-lg" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn btn-glass btn-lg">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
