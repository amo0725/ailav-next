import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'ailav_admin';
const ADMIN_UI_PREFIX = '/admin';
const ADMIN_API_PREFIX = '/api/admin';
const ADMIN_LOGIN = '/admin/login';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminUi = pathname.startsWith(ADMIN_UI_PREFIX) && pathname !== ADMIN_LOGIN;
  const isAdminApi = pathname.startsWith(ADMIN_API_PREFIX);

  if (isAdminUi || isAdminApi) {
    const cookie = request.cookies.get(ADMIN_COOKIE);
    if (!cookie?.value) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL(ADMIN_LOGIN, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  const isDev = process.env.NODE_ENV !== 'production';
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

  const csp = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://images.unsplash.com https://*.public.blob.vercel-storage.com data: blob:",
    "media-src 'self' https://assets.mixkit.co",
    "font-src 'self'",
    "connect-src 'self' https://*.public.blob.vercel-storage.com",
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
