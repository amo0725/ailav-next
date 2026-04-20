import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

type Stage = 'password' | 'totp';

let pwLimiter: Ratelimit | null = null;
let totpLimiter: Ratelimit | null = null;
let disabled = false;

function getLimiter(stage: Stage): Ratelimit | null {
  if (disabled) return null;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    disabled = true;
    return null;
  }

  if (stage === 'password') {
    if (!pwLimiter) {
      const redis = new Redis({ url, token });
      pwLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        prefix: 'ailav:admin-login:pw',
        analytics: false,
      });
    }
    return pwLimiter;
  }

  if (!totpLimiter) {
    const redis = new Redis({ url, token });
    totpLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '15 m'),
      prefix: 'ailav:admin-login:totp',
      analytics: false,
    });
  }
  return totpLimiter;
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number | null;
};

export async function checkLoginRateLimit(
  ip: string,
  stage: Stage,
  sessionKey?: string
): Promise<RateLimitResult> {
  const limiter = getLimiter(stage);
  if (!limiter) return { allowed: true, remaining: Infinity, resetAt: null };

  // TOTP stage is also keyed by session so a single valid password-holder
  // cannot burn the global budget for everyone else on the same IP.
  const key = stage === 'totp' && sessionKey ? `${ip}|${sessionKey}` : ip;
  const { success, remaining, reset } = await limiter.limit(key);
  return { allowed: success, remaining, resetAt: reset };
}
