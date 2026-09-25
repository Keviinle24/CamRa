import Image from 'next/image';
import Logo from '@/components/brand/Logo';
import { SOCIAL } from '@/lib/site';
import styles from './AuthShell.module.scss';

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.brand}>
        <div className="glow-field" aria-hidden />
        <Logo size={40} />
        <div>
          <p className={styles.brandTitle}>
            <span className="text-gradient">spontaneous video</span>
            <br />
            calling made different
          </p>
          <div className={styles.brandImage}>
            <Image
              src="/images/friends-collage.webp"
              alt=""
              width={560}
              height={547}
              sizes="(min-width: 1200px) 28vw, 36vw"
              priority
            />
          </div>
        </div>
        <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer" className={styles.social}>
          <i className="bi bi-instagram" aria-hidden /> {SOCIAL.instagram.handle}
        </a>
      </aside>

      <main className={styles.formSide}>
        <div className={styles.formInner}>
          <div className="d-lg-none text-center mb-4">
            <Logo size={40} />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <header className="mb-4">
      <h1 className="h2 fw-bold mb-2">{title}</h1>
      {subtitle && <p className="text-body-secondary mb-0">{subtitle}</p>}
    </header>
  );
}
