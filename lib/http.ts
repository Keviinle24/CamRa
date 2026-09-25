import 'server-only';
import { SetupError } from './config';
import { rateLimit } from './rate-limit';

type HttpErrorOptions = {
  /** Machine-readable reason the client can branch on, e.g. "unverified". */
  code?: string;
  retryAfter?: number;
  /** Extra fields merged into the JSON body. */
  details?: Record<string, unknown>;
};

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public options: HttpErrorOptions = {},
  ) {
    super(message);
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) {
    const { code, retryAfter, details } = error.options;
    return Response.json(
      { error: error.message, code, retryAfter, ...details },
      { status: error.status, headers: retryAfter ? { 'Retry-After': String(retryAfter) } : undefined },
    );
  }
  if (error instanceof SetupError) {
    console.error(`[setup] ${error.message}`);
    const message = process.env.NODE_ENV === 'production' ? error.publicMessage : `Server setup: ${error.message}`;
    return Response.json({ error: message, code: 'setup' }, { status: 503 });
  }
  console.error(error);
  return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
}

/** Wraps a route handler so thrown errors become JSON responses. */
export function handler<Args extends unknown[]>(fn: (...args: Args) => Promise<Response>) {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? body : {};
  } catch {
    throw new HttpError(400, 'Invalid request body.');
  }
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const { ok, retryAfter } = rateLimit(key, limit, windowMs);
  if (!ok) {
    throw new HttpError(429, `Too many attempts. Try again in ${retryAfter}s.`, { code: 'rate_limited', retryAfter });
  }
}
