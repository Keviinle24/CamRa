import { SOCIAL } from '@/lib/site';
import styles from './Landing.module.scss';

export default function ContactCard() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className={`gradient-border ${styles.contact}`}>
          <h2 className="display-6 fw-bold text-uppercase mb-2">Connect with us</h2>
          <p className="text-body-secondary fs-5 mb-4">Get the latest updates and giveaways here!</p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg">
              <i className="bi bi-instagram" aria-hidden /> {SOCIAL.instagram.handle}
            </a>
            <a href={`mailto:${SOCIAL.email}`} className="btn btn-glass btn-lg">
              <i className="bi bi-envelope" aria-hidden /> {SOCIAL.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
