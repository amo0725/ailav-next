import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  getRedirectUrl,
  unstable_doesMiddlewareMatch,
} from 'next/experimental/testing/server';
import { sealData } from 'iron-session';
import { config, proxy } from '@/proxy';
import type { AdminSessionData } from '@/lib/auth/session';

const ORIGIN = 'https://ailav.example';
const SESSION_SECRET = 'test-session-secret-at-least-32-characters-long';
const COOKIE = 'ailav_admin';

async function sessionCookie(
  data: AdminSessionData,
  password = SESSION_SECRET
): Promise<string> {
  const sealed = await sealData(data, { password, ttl: 60 * 60 });
  return `${COOKIE}=${sealed}`;
}

function request(path: string, cookie?: string): NextRequest {
  return new NextRequest(`${ORIGIN}${path}`, {
    headers: cookie ? { cookie } : undefined,
  });
}

function isPassThrough(res: Response): boolean {
  return res.headers.get('x-middleware-next') === '1';
}

function expectSecurityHeaders(res: Response) {
  const csp = res.headers.get('content-security-policy');
  expect(csp).toBeTruthy();
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("base-uri 'self'");
  expect(csp).toContain("form-action 'self'");
  expect(csp).toContain('frame-src \'self\' https://www.google.com https://maps.google.com');

  expect(res.headers.get('strict-transport-security')).toBe(
    'max-age=63072000; includeSubDomains; preload'
  );
  expect(res.headers.get('x-frame-options')).toBe('DENY');
  expect(res.headers.get('x-content-type-options')).toBe('nosniff');
  expect(res.headers.get('referrer-policy')).toBe(
    'strict-origin-when-cross-origin'
  );
  expect(res.headers.get('permissions-policy')).toBe(
    'camera=(), microphone=(), geolocation=()'
  );
}

beforeEach(() => {
  vi.stubEnv('ADMIN_SESSION_SECRET', SESSION_SECRET);
});

describe('proxy — public routes', () => {
  it.each(['/', '/menu', '/menu/print', '/robots.txt'])(
    'passes %s through with security headers',
    async (path) => {
      const res = await proxy(request(path));
      expect(isPassThrough(res)).toBe(true);
      expectSecurityHeaders(res);
    }
  );

  it('does not treat lookalike paths outside /admin as admin', async () => {
    const res = await proxy(request('/api/public'));
    expect(isPassThrough(res)).toBe(true);
  });
});

describe('proxy — Content-Security-Policy per environment', () => {
  it('omits unsafe-eval in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const csp = (await proxy(request('/'))).headers.get('content-security-policy')!;
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).not.toContain('unsafe-eval');
  });

  it('allows unsafe-eval outside production (dev tooling / HMR)', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const csp = (await proxy(request('/'))).headers.get('content-security-policy')!;
    expect(csp).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
  });
});

describe('proxy — unauthenticated admin access', () => {
  it.each(['/admin', '/admin/chefs', '/admin/menu-cards'])(
    'redirects %s to /admin/login',
    async (path) => {
      const res = await proxy(request(path));
      expect(res.status).toBe(307);
      expect(getRedirectUrl(res)).toBe(`${ORIGIN}/admin/login`);
    }
  );

  it('rejects /api/admin/* with a 401 JSON body instead of redirecting', async () => {
    const res = await proxy(request('/api/admin/upload'));
    expect(res.status).toBe(401);
    expect(getRedirectUrl(res)).toBeNull();
    await expect(res.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('rejects a session that only passed the password step (TOTP pending)', async () => {
    const cookie = await sessionCookie({ stage: 'totp', issuedAt: Date.now() });

    const ui = await proxy(request('/admin', cookie));
    expect(ui.status).toBe(307);
    expect(getRedirectUrl(ui)).toBe(`${ORIGIN}/admin/login`);

    const api = await proxy(request('/api/admin/upload', cookie));
    expect(api.status).toBe(401);
  });

  it('rejects a tampered session cookie', async () => {
    const cookie = await sessionCookie({ authenticated: true });
    // Flip one character inside the sealed payload so the HMAC no longer matches.
    const i = Math.floor(cookie.length / 2);
    const tampered =
      cookie.slice(0, i) + (cookie[i] === 'A' ? 'B' : 'A') + cookie.slice(i + 1);

    const res = await proxy(request('/api/admin/upload', tampered));
    expect(res.status).toBe(401);
  });

  it('rejects a cookie sealed with a different secret', async () => {
    const cookie = await sessionCookie(
      { authenticated: true },
      'some-other-secret-that-is-also-32-chars-plus'
    );

    const res = await proxy(request('/admin', cookie));
    expect(res.status).toBe(307);
    expect(getRedirectUrl(res)).toBe(`${ORIGIN}/admin/login`);
  });

  it('serves the login page itself (no redirect loop) with security headers', async () => {
    const res = await proxy(request('/admin/login'));
    expect(isPassThrough(res)).toBe(true);
    expectSecurityHeaders(res);
  });

  it('fails closed when ADMIN_SESSION_SECRET is missing or too short', async () => {
    vi.stubEnv('ADMIN_SESSION_SECRET', 'short');
    await expect(proxy(request('/admin'))).rejects.toThrow(/ADMIN_SESSION_SECRET/);
  });
});

describe('proxy — authenticated admin access', () => {
  it('lets an authenticated session through to admin pages with security headers', async () => {
    const cookie = await sessionCookie({ authenticated: true, stage: 'totp' });

    const res = await proxy(request('/admin/hero', cookie));
    expect(isPassThrough(res)).toBe(true);
    expectSecurityHeaders(res);
  });

  it('lets an authenticated session through to /api/admin/*', async () => {
    const cookie = await sessionCookie({ authenticated: true });

    const res = await proxy(request('/api/admin/upload', cookie));
    expect(isPassThrough(res)).toBe(true);
    expect(res.status).toBe(200);
  });

  it('bounces an already-authenticated user away from /admin/login', async () => {
    const cookie = await sessionCookie({ authenticated: true });

    const res = await proxy(request('/admin/login', cookie));
    expect(res.status).toBe(307);
    expect(getRedirectUrl(res)).toBe(`${ORIGIN}/admin`);
  });
});

describe('proxy matcher', () => {
  it.each([
    ['/', true],
    ['/menu', true],
    ['/admin', true],
    ['/admin/login', true],
    ['/api/admin/upload', true],
    ['/_next/static/chunks/main.js', false],
    ['/_next/image?url=%2Fa.jpg&w=640&q=75', false],
    ['/favicon.ico', false],
  ])('%s → runs proxy: %s', (url, expected) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(expected);
  });
});
