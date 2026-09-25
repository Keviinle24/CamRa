'use client';

import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel';
import styles from './Landing.module.scss';

const SLIDES = [
  {
    src: '/images/showcase/devices-landing.webp',
    alt: 'CamRa open on a laptop and a tablet',
    caption: 'Meet students from campuses worldwide',
  },
  {
    src: '/images/showcase/devices-chat.webp',
    alt: 'Students video chatting on CamRa from a laptop and a phone',
    caption: 'Face to face, on any device',
  },
  {
    src: '/images/showcase/laptop-chat-ui.webp',
    alt: 'The CamRa chat room with video tiles and a chat panel',
    caption: 'A simple, distraction-free chat room',
  },
  {
    src: '/images/showcase/register-preview.webp',
    alt: 'The CamRa sign-up screen',
    caption: 'Sign up with your student email',
  },
];

export default function ShowcaseCarousel() {
  return (
    <div className={styles.showcase}>
      <div className={styles.showcaseGlow} aria-hidden />
      <Carousel
        fade
        interval={4000}
        pause="hover"
        touch
        className={styles.carousel}
        prevIcon={<i className={`bi bi-chevron-left ${styles.carouselArrow}`} aria-hidden />}
        nextIcon={<i className={`bi bi-chevron-right ${styles.carouselArrow}`} aria-hidden />}
      >
        {SLIDES.map((slide, index) => (
          <Carousel.Item key={slide.src}>
            <div className={styles.slideFrame}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 992px) 45vw, 90vw"
                priority={index === 0}
                className={styles.slideImage}
              />
            </div>
            <p className={styles.slideCaption}>{slide.caption}</p>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
