import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Upstash is mocked with an in-memory sliding-log limiter so these tests
 * never touch the network. The fake honours the `slidingWindow(n, window)`
 * config the real module passes in, which lets us assert both the wiring
 * (prefixes, limits, keys) and the observable allow/block/reset behaviour.
 */
const upstash = vi.hoisted(() => {
  const redisInstances: Array<{ url: string; token: string }> = [];
  const limiterInstances: Array<{
    prefix: string;
    analytics: boolean;
    tokens: number;
    windowMs: number;
    keys: string[];
  }> = [];

  function parseWindow(window: string): number {
    const m = /^(\d+)\s*(ms|s|m|h|d)$/.exec(window);
    if (!m) throw new Error(`unsupported window ${window}`);
    const unit = { ms: 1, s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 }[
      m[2] as 'ms' | 's' | 'm' | 'h' | 'd'
    ];
    return Number(m[1]) * unit;
  }

  class Redis {
    constructor(opts: { url: string; token: string }) {
      redisInstances.push(opts);
    }
  }

  class Ratelimit {
    static slidingWindow(tokens: number, window: string) {
      return { tokens, windowMs: parseWindow(window) };
    }

    private readonly hits = new Map<string, number[]>();
    private readonly record: (typeof limiterInstances)[number];

    constructor(opts: {
      redis: Redis;
      limiter: { tokens: number; windowMs: number };
      prefix: string;
      analytics: boolean;
    }) {
      this.record = {
        prefix: opts.prefix,
        analytics: opts.analytics,
        tokens: opts.limiter.tokens,
        windowMs: opts.limiter.windowMs,
        keys: [],
      };
      limiterInstances.push(this.record);
    }

    async limit(key: string) {
      this.record.keys.push(key);
      const now = Date.now();
      const { tokens, windowMs } = this.record;
      const recent = (this.hits.get(key) ?? []).filter(
        (t) => t > now - windowMs
      );
      const success = recent.length < tokens;
      if (success) recent.push(now);
      this.hits.set(key, recent);
      return {
        success,
        limit: tokens,
        remaining: Math.max(0, tokens - recent.length),
        reset: (recent[0] ?? now) + windowMs,
        pending: Promise.resolve(),
      };
    }
  }

  return { Redis, Ratelimit, redisInstances, limiterInstances };
});

vi.mock('@upstash/redis', () => ({ Redis: upstash.Redis }));
vi.mock('@upstash/ratelimit', () => ({ Ratelimit: upstash.Ratelimit }));

const FIFTEEN_MIN = 15 * 60_000;
const T0 = Date.UTC(2026, 0, 1, 12, 0, 0);

// The module caches limiters (and a "disabled" latch) at module scope, so
// each test loads a fresh copy.
async function load() {
  return import('@/lib/auth/rate-limit');
}

function configureUpstash() {
  vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example.upstash.io');
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token');
}

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(T0);
  upstash.redisInstances.length = 0;
  upstash.limiterInstances.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkLoginRateLimit without Upstash configured', () => {
  it('allows every attempt and never constructs a client', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    const { checkLoginRateLimit } = await load();

    for (let i = 0; i < 20; i++) {
      await expect(checkLoginRateLimit('1.2.3.4', 'password')).resolves.toEqual(
        { allowed: true, remaining: Infinity, resetAt: null }
      );
    }
    expect(upstash.redisInstances).toHaveLength(0);
    expect(upstash.limiterInstances).toHaveLength(0);
  });

  it('treats a URL without a token as not configured', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    const { checkLoginRateLimit } = await load();

    const res = await checkLoginRateLimit('1.2.3.4', 'totp', 'sess');
    expect(res.allowed).toBe(true);
    expect(upstash.limiterInstances).toHaveLength(0);
  });
});

describe('checkLoginRateLimit — password stage', () => {
  beforeEach(configureUpstash);

  it('allows 5 attempts per IP, then blocks the 6th', async () => {
    const { checkLoginRateLimit } = await load();

    for (let i = 1; i <= 5; i++) {
      const res = await checkLoginRateLimit('1.2.3.4', 'password');
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(5 - i);
    }
    const blocked = await checkLoginRateLimit('1.2.3.4', 'password');
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetAt).toBe(T0 + FIFTEEN_MIN);
  });

  it('budgets each IP independently', async () => {
    const { checkLoginRateLimit } = await load();

    for (let i = 0; i < 5; i++) await checkLoginRateLimit('1.1.1.1', 'password');
    expect((await checkLoginRateLimit('1.1.1.1', 'password')).allowed).toBe(false);
    expect((await checkLoginRateLimit('2.2.2.2', 'password')).allowed).toBe(true);
  });

  it('allows attempts again once the 15-minute window has passed', async () => {
    const { checkLoginRateLimit } = await load();

    for (let i = 0; i < 5; i++) await checkLoginRateLimit('1.2.3.4', 'password');
    expect((await checkLoginRateLimit('1.2.3.4', 'password')).allowed).toBe(false);

    vi.setSystemTime(T0 + FIFTEEN_MIN - 1);
    expect((await checkLoginRateLimit('1.2.3.4', 'password')).allowed).toBe(false);

    vi.setSystemTime(T0 + FIFTEEN_MIN);
    expect((await checkLoginRateLimit('1.2.3.4', 'password')).allowed).toBe(true);
  });

  it('keys the password stage by IP only, ignoring any session key', async () => {
    const { checkLoginRateLimit } = await load();

    for (let i = 0; i < 5; i++) {
      await checkLoginRateLimit('1.2.3.4', 'password', `session-${i}`);
    }
    // Rotating the session cookie must not buy a fresh password budget.
    const res = await checkLoginRateLimit('1.2.3.4', 'password', 'session-new');
    expect(res.allowed).toBe(false);
    expect(upstash.limiterInstances[0].keys.every((k) => k === '1.2.3.4')).toBe(true);
  });
});

describe('checkLoginRateLimit — TOTP stage', () => {
  beforeEach(configureUpstash);

  it('allows 10 attempts per IP+session, then blocks', async () => {
    const { checkLoginRateLimit } = await load();

    for (let i = 0; i < 10; i++) {
      expect((await checkLoginRateLimit('1.2.3.4', 'totp', 'sess-a')).allowed).toBe(true);
    }
    expect((await checkLoginRateLimit('1.2.3.4', 'totp', 'sess-a')).allowed).toBe(false);
  });

  it('gives a different session on the same IP its own budget', async () => {
    const { checkLoginRateLimit } = await load();

    for (let i = 0; i < 10; i++) await checkLoginRateLimit('1.2.3.4', 'totp', 'sess-a');
    expect((await checkLoginRateLimit('1.2.3.4', 'totp', 'sess-a')).allowed).toBe(false);
    expect((await checkLoginRateLimit('1.2.3.4', 'totp', 'sess-b')).allowed).toBe(true);
    expect(upstash.limiterInstances[0].keys.at(-1)).toBe('1.2.3.4|sess-b');
  });

  it('falls back to keying by IP when no session key is supplied', async () => {
    const { checkLoginRateLimit } = await load();

    await checkLoginRateLimit('1.2.3.4', 'totp');
    expect(upstash.limiterInstances[0].keys).toEqual(['1.2.3.4']);
  });

  it('does not share its budget with the password stage', async () => {
    const { checkLoginRateLimit } = await load();

    for (let i = 0; i < 5; i++) await checkLoginRateLimit('1.2.3.4', 'password');
    expect((await checkLoginRateLimit('1.2.3.4', 'password')).allowed).toBe(false);
    expect((await checkLoginRateLimit('1.2.3.4', 'totp')).allowed).toBe(true);
  });
});

describe('limiter wiring', () => {
  beforeEach(configureUpstash);

  it('builds one limiter per stage with the expected config, and reuses it', async () => {
    const { checkLoginRateLimit } = await load();

    await checkLoginRateLimit('1.2.3.4', 'password');
    await checkLoginRateLimit('1.2.3.4', 'password');
    await checkLoginRateLimit('1.2.3.4', 'totp', 's');
    await checkLoginRateLimit('1.2.3.4', 'totp', 's');

    expect(upstash.redisInstances).toEqual([
      { url: 'https://example.upstash.io', token: 'test-token' },
      { url: 'https://example.upstash.io', token: 'test-token' },
    ]);
    expect(
      upstash.limiterInstances.map(({ prefix, analytics, tokens, windowMs }) => ({
        prefix,
        analytics,
        tokens,
        windowMs,
      }))
    ).toEqual([
      { prefix: 'ailav:admin-login:pw', analytics: false, tokens: 5, windowMs: FIFTEEN_MIN },
      { prefix: 'ailav:admin-login:totp', analytics: false, tokens: 10, windowMs: FIFTEEN_MIN },
    ]);
  });
});
