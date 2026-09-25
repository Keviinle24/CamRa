import Image from 'next/image';
import ContactCard from '@/components/landing/ContactCard';
import FeatureRow from '@/components/landing/FeatureRow';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import styles from '@/components/landing/Landing.module.scss';
import SiteFooter from '@/components/site/SiteFooter';
import SiteNavbar from '@/components/site/SiteNavbar';

export default function HomePage() {
  return (
    <>
      <SiteNavbar />
      <main>
        <Hero />
        <HowItWorks />

        <section id="community" className="section pt-0">
          <div className="container">
            <Image
              src="/images/community-collage.webp"
              alt="Photos of CamRa students hanging out, with the words Connect. Meet. Chat."
              width={2400}
              height={1623}
              sizes="(min-width: 1400px) 1320px, 95vw"
              className={styles.collage}
            />
          </div>
        </section>

        <section className="section pt-0">
          <div className="container d-grid" style={{ rowGap: 'clamp(4rem, 8vw, 7rem)' }}>
            <FeatureRow
              image={{
                src: '/images/friends-collage.webp',
                alt: 'Groups of students smiling together',
                width: 560,
                height: 547,
              }}
              highlight="Create long-lasting connections"
              title="one university at a time"
              cta={{ href: '/register', label: 'Join now' }}
            >
              Join CamRa to connect with college students globally! Explore the lives and campuses of other students.
              Discover new friends, share experiences, and engage in meaningful conversations, all at your fingertips.
            </FeatureRow>
            <FeatureRow
              reverse
              image={{
                src: '/images/dorm-window.webp',
                alt: 'A dorm room desk by a window overlooking campus',
                width: 405,
                height: 428,
              }}
              highlight="Exploring"
              title="different perspectives"
              cta={{ href: '/register', label: 'Register' }}
            >
              Get a peek into the life of other students and their colleges around the world. Explore diverse cultures,
              share experiences, and build connections! Sign up for free today.
            </FeatureRow>
          </div>
        </section>

        <ContactCard />
      </main>
      <SiteFooter />
    </>
  );
}
