import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import { SOCIAL } from '@/lib/site';

export default function NotFound() {
  return (
    <main className="position-relative min-vh-100 d-grid align-items-center py-5" style={{ isolation: 'isolate' }}>
      <div className="glow-field" aria-hidden />
      <div className="container text-center" style={{ maxWidth: 560 }}>
        <Logo size={40} className="mb-5" />
        <p className="display-1 fw-bold text-gradient mb-2">404</p>
        <h1 className="h2 fw-bold mb-3">We couldn&rsquo;t find that page</h1>
        <p className="text-body-secondary mb-4">The link might be broken, or the page may have moved.</p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Link href="/" className="btn btn-gradient btn-lg">
            Go home
          </Link>
          <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg">
            <i className="bi bi-instagram" aria-hidden /> {SOCIAL.instagram.handle}
          </a>
        </div>
      </div>
    </main>
  );
}
