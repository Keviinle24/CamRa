import Image from 'next/image';
import Link from 'next/link';
import styles from './Landing.module.scss';

type FeatureRowProps = {
  image: { src: string; alt: string; width: number; height: number };
  highlight: string;
  title: string;
  children: React.ReactNode;
  cta: { href: string; label: string };
  reverse?: boolean;
};

export default function FeatureRow({ image, highlight, title, children, cta, reverse = false }: FeatureRowProps) {
  return (
    <div className={`row align-items-center gy-5 gx-lg-5 ${reverse ? 'flex-lg-row-reverse' : ''}`}>
      <div className="col-lg-6">
        <div className={styles.featureImage}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 992px) 40vw, 90vw"
          />
        </div>
      </div>
      <div className="col-lg-6 text-center text-lg-start">
        <h2 className="display-5 fw-bold mb-4">
          <span className="text-gradient">{highlight}</span> {title}
        </h2>
        <p className="lead text-body-secondary mb-4">{children}</p>
        <Link href={cta.href} className="btn btn-gradient btn-lg">
          {cta.label} <i className="bi bi-arrow-right" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
