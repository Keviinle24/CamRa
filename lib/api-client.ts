// Tiny fetch wrapper for calling our JSON API from the browser.

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data: Record<string, unknown> | null,
  ) {
    super(message);
  }

  get code() {
    return typeof this.data?.code === 'string' ? this.data.code : undefined;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  keepalive?: boolean;
  signal?: AbortSignal;
};

export async function api<T = Record<string, unknown>>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'POST', body, keepalive, signal } = options;
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      keepalive,
      signal,
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    throw new ApiError(0, "Couldn't reach CamRa. Check your connection and try again.", null);
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof data?.error === 'string' ? data.error : 'Something went wrong. Please try again.';
    throw new ApiError(response.status, message, data);
  }
  return data as T;
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

/** Only allow same-site relative redirects (prevents open-redirects via ?next=). */
export function safeNextPath(next: string | undefined, fallback = '/chat') {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}
