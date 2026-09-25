import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  href?: string;
  /** Height of the camera mark in pixels. */
  size?: number;
  className?: string;
};

export default function Logo({ href = '/', size = 36, className = '' }: LogoProps) {
  return (
    <Link
      href={href}
      className={`d-inline-flex align-items-center gap-2 text-decoration-none ${className}`}
      aria-label="CamRa home"
    >
      <Image src="/images/logo-mark.png" alt="" width={Math.round(size * 1.35)} height={size} priority />
      <span className="wordmark" style={{ fontSize: size * 0.8 }}>
        CamRa
      </span>
    </Link>
  );
}
