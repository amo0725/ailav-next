import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let limiter: Ratelimit | null = null;
let disabled = false;

function getLimiter(): Ratelimit | null {
  if (disabled) return null;
  if (limiter) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    disabled = true;
    return null;
  }
  const redis = new Redis({ url, token });
  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'ailav:admin-login',
    analytics: false,
  });
  return limiter;
}

export async function checkLoginRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number | null;
}> {
  const l = getLimiter();
  if (!l) return { allowed: true, remaining: Infinity, resetAt: null };
  const { success, remaining, reset } = await l.limit(ip);
  return { allowed: success, remaining, resetAt: reset };
}
