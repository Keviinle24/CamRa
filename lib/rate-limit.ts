type Bucket = { count: number; resetAt: number };

// Fixed-window counters kept in memory. Good enough for a single server; use a
// shared store (e.g. Redis) if you run several instances behind a load balancer.
const globalForLimits = globalThis as typeof globalThis & { rateLimitBuckets?: Map<string, Bucket> };
const buckets = (globalForLimits.rateLimitBuckets ??= new Map());

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;

  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  return { ok: bucket.count <= limit, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
}
