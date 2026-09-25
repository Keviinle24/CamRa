'use client';

import InterestFilter from './InterestFilter';
import styles from './Chat.module.scss';

type LobbyProps = {
  interests: string[];
  onInterestsChange: (tags: string[]) => void;
  onStart: () => void;
  error: string | null;
  onDismissError: () => void;
};

export default function Lobby({ interests, onInterestsChange, onStart, error, onDismissError }: LobbyProps) {
  return (
    <main className={styles.lobby}>
      <div className="glow-field" aria-hidden />
      <div className={styles.lobbyInner}>
        <p className="eyebrow mb-3">Ready when you are</p>
        <h1 className={styles.lobbyTitle}>
          Add <span className="text-gradient">filters</span> to customize your experience
        </h1>
        <p className="text-body-secondary mb-4">
          Add a few interests (or your university) and we&rsquo;ll try to match you with someone who shares one.
          Totally optional.
        </p>

        {error && (
          <div className="alert alert-danger d-flex align-items-start gap-2 text-start" role="alert">
            <i className="bi bi-exclamation-triangle-fill mt-1" aria-hidden />
            <div className="flex-grow-1">{error}</div>
            <button type="button" className="btn-close" aria-label="Dismiss" onClick={onDismissError} />
          </div>
        )}

        <div className="glass-card p-3 p-sm-4 text-start mb-4">
          <InterestFilter value={interests} onChange={onInterestsChange} />
        </div>

        <button type="button" className="btn btn-gradient btn-lg px-5" onClick={onStart}>
          <i className="bi bi-camera-video-fill" aria-hidden /> Start chatting
        </button>
        <p className="small text-body-secondary mt-3 mb-0">
          <i className="bi bi-shield-lock me-1" aria-hidden />
          You&rsquo;ll be asked to allow camera and microphone access.
        </p>
      </div>
    </main>
  );
}
