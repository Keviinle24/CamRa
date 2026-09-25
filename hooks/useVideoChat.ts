'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import type { RTMClient, RTMEvents } from 'agora-rtm-sdk';
import { ApiError, api } from '@/lib/api-client';
import { HEARTBEAT_INTERVAL_MS, MAX_SKIPPED_ROOMS, SKIP_ROOM_MS } from '@/lib/chat-config';
import { MESSAGE_MAX_LENGTH } from '@/lib/validation';

export type ChatStatus = 'idle' | 'starting' | 'searching' | 'waiting' | 'connected';

export type ChatMessage = { id: number; from: 'me' | 'stranger' | 'system'; text: string };

type JoinResponse = {
  appId: string;
  callId: string;
  roomId: string;
  status: 'waiting' | 'chatting';
  rtcToken: string;
  rtmToken: string;
};

type HeartbeatResponse = {
  status: 'waiting' | 'chatting';
  rematch: boolean;
  tokens?: { rtcToken: string; rtmToken: string };
};

/** Everything that lives for one Start → Stop session. Mutable on purpose: SDK callbacks read it. */
type CallSession = {
  rtc: IAgoraRTCClient;
  mic: IMicrophoneAudioTrack;
  camera: ICameraVideoTrack;
  rtm: RTMClient | null;
  rtmUserId: string | null;
  interests: string[];
  callId: string | null;
  roomId: string | null;
  partner: UID | null;
  heartbeat: ReturnType<typeof setInterval> | null;
  skip: Map<string, number>; // roomId -> expiry
};

function mediaErrorMessage(error: unknown) {
  const { code = '', name = '', message = '' } = (error ?? {}) as { code?: string; name?: string; message?: string };
  const text = `${code} ${name} ${message}`;
  if (/PERMISSION_DENIED|NotAllowed/i.test(text)) {
    return 'CamRa needs your camera and microphone. Allow access in your browser settings, then try again.';
  }
  if (/DEVICE_NOT_FOUND|NotFound|OverConstrained|CONSTRAINT_NOT_SATISFIED/i.test(text)) {
    return "We couldn't find a camera or microphone. Connect one and try again.";
  }
  if (/NOT_READABLE|NotReadable|TrackStart/i.test(text)) {
    return 'Your camera or microphone is being used by another app. Close it and try again.';
  }
  if (/NOT_SUPPORTED|WEB_SECURITY_RESTRICT/i.test(text)) {
    return 'Your browser blocked camera access. Use an up-to-date browser over HTTPS.';
  }
  return "We couldn't start your camera and microphone. Please try again.";
}

/** An error whose message is safe to show the user as-is. */
class ChatError extends Error {}

function sessionErrorMessage(error: unknown) {
  if (error instanceof ApiError || error instanceof ChatError) return error.message;
  console.error('[chat]', error);
  const detail = process.env.NODE_ENV === 'development' && error instanceof Error ? ` (${error.message})` : '';
  return `We couldn't connect to the video service. Please try again.${detail}`;
}

function activeSkips(session: CallSession) {
  const now = Date.now();
  for (const [roomId, expiry] of session.skip) if (expiry <= now) session.skip.delete(roomId);
  return [...session.skip.keys()].slice(-MAX_SKIPPED_ROOMS);
}

export function useVideoChat() {
  const router = useRouter();
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [localVideo, setLocalVideo] = useState<ICameraVideoTrack | null>(null);
  const [remoteVideo, setRemoteVideo] = useState<IRemoteVideoTrack | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sessionRef = useRef<CallSession | null>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingRef = useRef(0);
  const messageIdRef = useRef(0);

  const pushMessage = useCallback((from: ChatMessage['from'], text: string) => {
    setMessages((list) => [...list, { id: ++messageIdRef.current, from, text }].slice(-200));
  }, []);

  // --- Room lifecycle -------------------------------------------------------

  const stopHeartbeat = useCallback((session: CallSession) => {
    if (session.heartbeat) clearInterval(session.heartbeat);
    session.heartbeat = null;
  }, []);

  const leaveRoom = useCallback(
    async (session: CallSession, { skip }: { skip: boolean }) => {
      stopHeartbeat(session);
      const { roomId, callId } = session;
      session.roomId = null;
      session.partner = null;
      setRemoteVideo(null);
      if (!roomId) return;
      if (skip) session.skip.set(roomId, Date.now() + SKIP_ROOM_MS);
      await Promise.allSettled([
        session.rtm?.unsubscribe(roomId),
        session.rtc.leave(),
        api(`/api/rooms/${roomId}/leave`, { body: { callId } }),
      ]);
    },
    [stopHeartbeat],
  );

  const teardown = useCallback(
    async (session: CallSession) => {
      if (sessionRef.current === session) sessionRef.current = null;
      await leaveRoom(session, { skip: false });
      session.mic.close();
      session.camera.close();
      session.rtc.removeAllListeners();
      await session.rtm?.logout().catch(() => undefined);
      setLocalVideo(null);
      setRemoteVideo(null);
      setAudioBlocked(false);
    },
    [leaveRoom],
  );

  // Every state-changing operation runs through this queue so Start/Next/Stop
  // (and automatic rematches) never overlap. A failure tears the session down.
  const enqueue = useCallback(
    (task: () => Promise<void>) => {
      pendingRef.current += 1;
      setBusy(true);
      const run = queueRef.current
        .then(task)
        .catch(async (err: unknown) => {
          const session = sessionRef.current;
          if (session) await teardown(session).catch((cleanupError) => console.error('[chat]', cleanupError));
          setStatus('idle');
          setMessages([]);
          if (err instanceof ApiError && err.status === 401) {
            router.replace('/login?next=/chat');
            return;
          }
          setError(sessionErrorMessage(err));
        })
        .finally(() => {
          pendingRef.current -= 1;
          if (pendingRef.current === 0) setBusy(false);
        });
      queueRef.current = run.catch(() => undefined); // never let one failure block later tasks
      return run;
    },
    [router, teardown],
  );

  const onPartnerJoined = useCallback(
    (session: CallSession, uid: UID) => {
      if (session.partner === uid) return;
      session.partner = uid;
      setMessages([]);
      pushMessage('system', "You're connected with a student. Say hi! 👋");
      setStatus('connected');
    },
    [pushMessage],
  );

  const onPartnerLeft = useCallback(
    (session: CallSession, uid: UID) => {
      if (session.partner !== uid) return;
      session.partner = null;
      setRemoteVideo(null);
      pushMessage('system', 'Your partner left the chat. Waiting for someone new…');
      setStatus('waiting');
    },
    [pushMessage],
  );

  const connectMessaging = useCallback(
    async (session: CallSession, join: JoinResponse) => {
      if (session.rtm && session.rtmUserId !== join.callId) {
        await session.rtm.logout().catch(() => undefined);
        session.rtm = null;
      }
      if (!session.rtm) {
        const { default: AgoraRTM } = await import('agora-rtm-sdk');
        const rtm = new AgoraRTM.RTM(join.appId, join.callId, { logLevel: 'error', logUpload: false });
        rtm.addEventListener('message', (event: RTMEvents.MessageEvent) => {
          if (sessionRef.current !== session || event.channelName !== session.roomId) return;
          if (event.publisher === session.callId || typeof event.message !== 'string') return;
          try {
            const payload = JSON.parse(event.message) as { type?: string; text?: unknown };
            if (payload.type === 'chat' && typeof payload.text === 'string' && payload.text.trim()) {
              pushMessage('stranger', payload.text.trim().slice(0, MESSAGE_MAX_LENGTH));
            }
          } catch {
            // Ignore messages that aren't ours.
          }
        });
        await rtm.login({ token: join.rtmToken });
        session.rtm = rtm;
        session.rtmUserId = join.callId;
      } else {
        await session.rtm.renewToken(join.rtmToken).catch(() => undefined);
      }
      await session.rtm.subscribe(join.roomId, { withMessage: true, withPresence: false });
    },
    [pushMessage],
  );

  // sendHeartbeat needs joinRoom, which is defined after it, so it goes through a ref.
  const joinRoomRef = useRef<(session: CallSession) => Promise<void>>(async () => undefined);

  const sendHeartbeat = useCallback(
    async (session: CallSession, renew = false) => {
      const roomId = session.roomId;
      if (sessionRef.current !== session || !roomId) return;
      try {
        const result = await api<HeartbeatResponse>(`/api/rooms/${roomId}`, {
          method: 'PATCH',
          body: { callId: session.callId, skip: activeSkips(session), renew },
        });
        if (session.roomId !== roomId) return;
        if (result.tokens) {
          await session.rtc.renewToken(result.tokens.rtcToken);
          await session.rtm?.renewToken(result.tokens.rtmToken);
        }
        if (result.rematch && !session.partner) {
          // Someone has been waiting longer in another room: move there.
          void enqueue(async () => {
            if (session.roomId !== roomId || session.partner) return;
            await leaveRoom(session, { skip: false });
            await joinRoomRef.current(session);
          });
        }
      } catch (err) {
        if (!(err instanceof ApiError) || err.status === 0) return; // offline blip: retry on the next beat
        if (err.status === 404) {
          // Our membership lapsed (e.g. the tab was asleep): find a new room.
          void enqueue(async () => {
            if (session.roomId !== roomId) return;
            await leaveRoom(session, { skip: false });
            await joinRoomRef.current(session);
          });
        } else if (err.status === 401) {
          void enqueue(async () => {
            throw err;
          });
        }
      }
    },
    [enqueue, leaveRoom],
  );

  const joinRoom = useCallback(
    async (session: CallSession) => {
      setStatus('searching');
      setMessages([]);
      setRemoteVideo(null);
      session.partner = null;

      const join = await api<JoinResponse>('/api/rooms', {
        body: { callId: session.callId, interests: session.interests, skip: activeSkips(session) },
      });
      session.callId = join.callId;
      session.roomId = join.roomId;

      await connectMessaging(session, join);
      await session.rtc.join(join.appId, join.roomId, join.rtcToken, join.callId);
      await session.rtc.publish([session.mic, session.camera]);

      setStatus(session.partner ? 'connected' : 'waiting');
      stopHeartbeat(session);
      session.heartbeat = setInterval(() => void sendHeartbeat(session), HEARTBEAT_INTERVAL_MS);
    },
    [connectMessaging, sendHeartbeat, stopHeartbeat],
  );

  useEffect(() => {
    joinRoomRef.current = joinRoom;
  }, [joinRoom]);

  const bindRtcEvents = useCallback(
    (session: CallSession) => {
      const { rtc } = session;
      const current = () => sessionRef.current === session;

      rtc.on('user-joined', (user) => {
        if (current()) onPartnerJoined(session, user.uid);
      });
      rtc.on('user-left', (user) => {
        if (current()) onPartnerLeft(session, user.uid);
      });
      rtc.on('user-published', async (user, mediaType) => {
        if (!current()) return;
        if (session.partner === null) onPartnerJoined(session, user.uid);
        if (user.uid !== session.partner) return;
        try {
          await rtc.subscribe(user, mediaType);
        } catch (err) {
          console.error('[chat] subscribe failed', err);
          return;
        }
        if (mediaType === 'video') setRemoteVideo(user.videoTrack ?? null);
        if (mediaType === 'audio') user.audioTrack?.play();
      });
      rtc.on('user-unpublished', (user, mediaType) => {
        if (current() && user.uid === session.partner && mediaType === 'video') setRemoteVideo(null);
      });
      rtc.on('token-privilege-will-expire', () => void sendHeartbeat(session, true));
      rtc.on('connection-state-change', (state, _previous, reason) => {
        if (current() && state === 'DISCONNECTED' && reason && reason !== 'LEAVE') {
          void enqueue(async () => {
            throw new ChatError('The connection was lost. Start again when you’re ready.');
          });
        }
      });
    },
    [enqueue, onPartnerJoined, onPartnerLeft, sendHeartbeat],
  );

  // --- Public actions --------------------------------------------------------

  const start = useCallback(
    (interests: string[]) =>
      enqueue(async () => {
        if (sessionRef.current) return;
        setError(null);
        setStatus('starting');

        const { default: AgoraRTC } = await import('agora-rtc-sdk-ng');
        AgoraRTC.setLogLevel(3);
        AgoraRTC.onAutoplayFailed = () => setAudioBlocked(true);

        let tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
        try {
          tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
            { AEC: true, ANS: true },
            { encoderConfig: '720p_1', facingMode: 'user' },
          );
        } catch (err) {
          setStatus('idle');
          setError(mediaErrorMessage(err));
          return;
        }

        const [mic, camera] = tracks;
        const session: CallSession = {
          rtc: AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
          mic,
          camera,
          rtm: null,
          rtmUserId: null,
          interests,
          callId: null,
          roomId: null,
          partner: null,
          heartbeat: null,
          skip: new Map(),
        };
        sessionRef.current = session;
        bindRtcEvents(session);
        setMicMuted(false);
        setCameraOff(false);
        setLocalVideo(camera);
        await joinRoom(session);
      }),
    [bindRtcEvents, enqueue, joinRoom],
  );

  const next = useCallback(
    () =>
      enqueue(async () => {
        const session = sessionRef.current;
        if (!session) return;
        await leaveRoom(session, { skip: true });
        await joinRoom(session);
      }),
    [enqueue, joinRoom, leaveRoom],
  );

  const stop = useCallback(
    () =>
      enqueue(async () => {
        const session = sessionRef.current;
        if (!session) return;
        await teardown(session);
        setStatus('idle');
        setMessages([]);
      }),
    [enqueue, teardown],
  );

  const sendMessage = useCallback(
    async (raw: string) => {
      const session = sessionRef.current;
      const text = raw.trim().slice(0, MESSAGE_MAX_LENGTH);
      if (!session?.rtm || !session.roomId || !session.partner || !text) return false;
      try {
        await session.rtm.publish(session.roomId, JSON.stringify({ type: 'chat', text }));
        pushMessage('me', text);
        return true;
      } catch (err) {
        console.error('[chat] message failed', err);
        pushMessage('system', "Your message couldn't be sent. Try again.");
        return false;
      }
    },
    [pushMessage],
  );

  const toggleMic = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return;
    const muted = !session.mic.muted;
    await session.mic.setMuted(muted);
    setMicMuted(muted);
  }, []);

  const toggleCamera = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return;
    const muted = !session.camera.muted;
    await session.camera.setMuted(muted);
    setCameraOff(muted);
  }, []);

  const unlockAudio = useCallback(() => {
    sessionRef.current?.rtc.remoteUsers.forEach((user) => user.audioTrack?.play());
    setAudioBlocked(false);
  }, []);

  // --- Cleanup ---------------------------------------------------------------

  useEffect(() => {
    // Closing the tab: tell the server right away so nobody gets matched into a dead room.
    const onPageHide = () => {
      const session = sessionRef.current;
      if (!session?.roomId) return;
      const url = `/api/rooms/${session.roomId}/leave`;
      const body = JSON.stringify({ callId: session.callId });
      if (!navigator.sendBeacon?.(url, new Blob([body], { type: 'application/json' }))) {
        void fetch(url, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
      }
    };
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      const session = sessionRef.current;
      if (session) void teardown(session);
    };
  }, [teardown]);

  return {
    status,
    messages,
    localVideo,
    remoteVideo,
    micMuted,
    cameraOff,
    audioBlocked,
    error,
    busy,
    start,
    next,
    stop,
    sendMessage,
    toggleMic,
    toggleCamera,
    unlockAudio,
    dismissError: () => setError(null),
  };
}

export type VideoChat = ReturnType<typeof useVideoChat>;
