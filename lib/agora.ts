import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { RtcRole, RtcTokenBuilder, RtmTokenBuilder } from 'agora-token';
import { requireEnv } from './config';
import { HttpError } from './http';

const TOKEN_TTL_SECONDS = 60 * 60 * 6;

function credentials() {
  // AGORA_APP_ID is read at runtime; NEXT_PUBLIC_AGORA_APP_ID is kept for existing deployments.
  const appId = process.env.AGORA_APP_ID || process.env.NEXT_PUBLIC_AGORA_APP_ID;
  const certificate = process.env.AGORA_APP_CERT;
  if (!appId || !certificate) {
    throw new HttpError(503, "Video chat isn't configured yet (missing Agora credentials).", { code: 'agora_not_configured' });
  }
  return { appId, certificate };
}

export function agoraAppId() {
  return credentials().appId;
}

// A call ID is the uid we use in Agora. It is random per chat session so
// partners can't identify each other, and HMAC-signed with the user id so a
// client can't request tokens for somebody else's call ID (which would kick
// that person out of the channel).
function signature(userId: string, nonce: string) {
  return createHmac('sha256', requireEnv('JWT_SECRETKEY')).update(`call:${userId}:${nonce}`).digest('hex').slice(0, 24);
}

export function issueCallId(userId: string) {
  const nonce = randomBytes(8).toString('hex');
  // Agora RTM only accepts [A-Za-z0-9] and some punctuation in user ids (not '.', despite the docs).
  return `${nonce}-${signature(userId, nonce)}`;
}

export function isValidCallId(userId: string, callId: unknown): callId is string {
  if (typeof callId !== 'string') return false;
  const [nonce, sig] = callId.split('-');
  if (!nonce || !sig || !/^[0-9a-f]{16}$/.test(nonce)) return false;
  const expected = Buffer.from(signature(userId, nonce));
  const received = Buffer.from(sig);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function issueTokens(roomId: string, callId: string) {
  const { appId, certificate } = credentials();
  return {
    rtcToken: RtcTokenBuilder.buildTokenWithUserAccount(
      appId,
      certificate,
      roomId,
      callId,
      RtcRole.PUBLISHER,
      TOKEN_TTL_SECONDS,
      TOKEN_TTL_SECONDS,
    ),
    rtmToken: RtmTokenBuilder.buildToken(appId, certificate, callId, TOKEN_TTL_SECONDS),
  };
}
