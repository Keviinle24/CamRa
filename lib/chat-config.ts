// Timings shared by the matchmaking API and the browser client.

/** How often a client in a room pings the server. */
export const HEARTBEAT_INTERVAL_MS = 5_000;

/** A member who hasn't sent a heartbeat for this long is considered gone. */
export const STALE_MEMBER_MS = 30_000;

/** After pressing "Next", avoid being matched with the same room for this long. */
export const SKIP_ROOM_MS = 60_000;

/** How many recently-left rooms a client asks the server to skip. */
export const MAX_SKIPPED_ROOMS = 5;
