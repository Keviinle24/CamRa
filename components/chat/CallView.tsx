'use client';

import type { VideoChat } from '@/hooks/useVideoChat';
import ChatPanel from './ChatPanel';
import VideoTile from './VideoTile';
import styles from './Chat.module.scss';

function Placeholder({ icon, spinner, title, hint }: { icon?: string; spinner?: boolean; title: string; hint?: string }) {
  return (
    <>
      {spinner ? (
        <span className={styles.searchPulse} aria-hidden>
          <i className="bi bi-broadcast" />
        </span>
      ) : (
        <i className={`bi ${icon} ${styles.placeholderIcon}`} aria-hidden />
      )}
      <p className={styles.placeholderTitle}>{title}</p>
      {hint && <p className={styles.placeholderHint}>{hint}</p>}
    </>
  );
}

function remotePlaceholder(status: VideoChat['status']) {
  switch (status) {
    case 'starting':
      return <Placeholder spinner title="Starting your camera…" />;
    case 'searching':
      return <Placeholder spinner title="Finding someone for you…" />;
    case 'waiting':
      return <Placeholder spinner title="Waiting for someone to join…" hint="Hang tight, or press Next to try again." />;
    default:
      return <Placeholder icon="bi-camera-video-off" title="Their camera is off" />;
  }
}

export default function CallView({ chat }: { chat: VideoChat }) {
  const inRoom = chat.status === 'waiting' || chat.status === 'connected';

  return (
    <main className={styles.call}>
      <section className={styles.videos} aria-label="Video">
        <VideoTile
          track={chat.remoteVideo}
          label="Stranger"
          placeholder={remotePlaceholder(chat.status)}
          className={styles.remoteTile}
        >
          {chat.audioBlocked && (
            <button type="button" className="btn btn-gradient" onClick={chat.unlockAudio}>
              <i className="bi bi-volume-up-fill" aria-hidden /> Tap to hear your partner
            </button>
          )}
        </VideoTile>
        <VideoTile
          track={chat.cameraOff ? null : chat.localVideo}
          label="You"
          mirror
          placeholder={
            chat.cameraOff ? (
              <Placeholder icon="bi-camera-video-off" title="Camera off" />
            ) : (
              <span className="spinner-border text-info" aria-hidden />
            )
          }
          badge={chat.micMuted ? <i className="bi bi-mic-mute-fill text-danger ms-2" aria-label="Muted" /> : null}
          className={styles.localTile}
        />
      </section>

      <ChatPanel messages={chat.messages} status={chat.status} onSend={chat.sendMessage}>
        <div className={styles.controls}>
          <div className="d-flex gap-2">
            <button
              type="button"
              className={`${styles.roundButton} ${chat.micMuted ? styles.roundButtonOff : ''}`}
              onClick={chat.toggleMic}
              aria-pressed={chat.micMuted}
              aria-label={chat.micMuted ? 'Unmute microphone' : 'Mute microphone'}
              title={chat.micMuted ? 'Unmute' : 'Mute'}
              disabled={chat.status === 'starting'}
            >
              <i className={`bi ${chat.micMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'}`} aria-hidden />
            </button>
            <button
              type="button"
              className={`${styles.roundButton} ${chat.cameraOff ? styles.roundButtonOff : ''}`}
              onClick={chat.toggleCamera}
              aria-pressed={chat.cameraOff}
              aria-label={chat.cameraOff ? 'Turn camera on' : 'Turn camera off'}
              title={chat.cameraOff ? 'Camera on' : 'Camera off'}
              disabled={chat.status === 'starting'}
            >
              <i className={`bi ${chat.cameraOff ? 'bi-camera-video-off-fill' : 'bi-camera-video-fill'}`} aria-hidden />
            </button>
          </div>
          <div className="d-flex gap-2 ms-auto">
            <button type="button" className="btn btn-outline-danger" onClick={chat.stop}>
              <i className="bi bi-stop-fill" aria-hidden /> Stop
            </button>
            <button type="button" className="btn btn-gradient" onClick={chat.next} disabled={!inRoom || chat.busy}>
              {chat.busy && inRoom ? (
                <span className="spinner-border spinner-border-sm" aria-hidden />
              ) : (
                <i className="bi bi-skip-forward-fill" aria-hidden />
              )}
              Next
            </button>
          </div>
        </div>
      </ChatPanel>
    </main>
  );
}
