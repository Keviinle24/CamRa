'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { ICameraVideoTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import styles from './Chat.module.scss';

type VideoTileProps = {
  track: ICameraVideoTrack | IRemoteVideoTrack | null;
  label: string;
  mirror?: boolean;
  /** Shown when there is no video. */
  placeholder: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export default function VideoTile({ track, label, mirror = false, placeholder, badge, className = '', children }: VideoTileProps) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!track || !element) return;
    track.play(element, { fit: 'cover', mirror });
    return () => track.stop();
  }, [track, mirror]);

  return (
    <div className={`${styles.tile} ${className}`}>
      <div ref={videoRef} className={styles.tileVideo} hidden={!track} />
      {!track && <div className={styles.tilePlaceholder}>{placeholder}</div>}
      <span className={styles.tileLabel}>
        {label}
        {badge}
      </span>
      <Image src="/images/logo-mark.png" alt="" width={34} height={25} className={styles.tileWatermark} />
      {children && <div className={styles.tileOverlay}>{children}</div>}
    </div>
  );
}
