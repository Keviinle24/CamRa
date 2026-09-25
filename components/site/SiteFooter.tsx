import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import { SOCIAL } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="border-top border-secondary-subtle py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
          <Logo size={30} />
          <nav className="d-flex gap-4 small" aria-label="Legal">
            <Link href="/terms" className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none">
              Terms
            </Link>
            <Link href="/privacy" className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none">
              Privacy
            </Link>
            <a
              href={`mailto:${SOCIAL.email}`}
              className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
            >
              Contact
            </a>
          </nav>
          <div className="d-flex gap-3 fs-5">
            <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="CamRa on Instagram" className="link-light">
              <i className="bi bi-instagram" aria-hidden />
            </a>
            <a href={SOCIAL.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="CamRa on LinkedIn" className="link-light">
              <i className="bi bi-linkedin" aria-hidden />
            </a>
          </div>
        </div>
        <p className="text-center text-body-secondary small mt-4 mb-0">
          © {new Date().getFullYear()} CamRa
        </p>
      </div>
    </footer>
  );
}
