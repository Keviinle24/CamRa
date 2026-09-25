import Link from 'next/link';
import { UNIVERSITIES } from '@/lib/universities';
import ShowcaseCarousel from './ShowcaseCarousel';
import styles from './Landing.module.scss';

const HIGHLIGHTS = [
  { icon: 'bi-mortarboard', label: `${Math.floor(UNIVERSITIES.length / 10) * 10}+ universities` },
  { icon: 'bi-patch-check', label: 'Verified student emails' },
  { icon: 'bi-stars', label: 'Free to join' },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="glow-field" aria-hidden />
      <div className="container">
        <div className={`glass-card ${styles.heroPanel}`}>
          <div className="row align-items-center gy-5 gx-lg-5">
            <div className="col-lg-6 text-center text-lg-start">
              <p className="eyebrow mb-3">Video chat for college students</p>
              <h1 className={styles.heroTitle}>
                The future
                <span className="d-block text-gradient">of college networking</span>
              </h1>
              <p className={`lead text-body-secondary mt-4 mb-5 ${styles.heroLead}`}>
                Connect with college students around the world with <span className="wordmark">CamRa</span>. Meet
                and chat with students like yourself with just a click. Sign up today and start expanding your
                network!
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link href="/register" className="btn btn-gradient btn-lg">
                  Get started <i className="bi bi-arrow-right" aria-hidden />
                </Link>
                <Link href="/login" className="btn btn-glass btn-lg">
                  I have an account
                </Link>
              </div>
              <ul className={styles.highlights}>
                {HIGHLIGHTS.map(({ icon, label }) => (
                  <li key={label}>
                    <i className={`bi ${icon}`} aria-hidden /> {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <ShowcaseCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
