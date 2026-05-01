import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import {
  sessionOptions,
  type AdminSessionData,
} from '@/lib/auth/session';

const ADMIN_UI_PREFIX = '/admin';
const ADMIN_API_PREFIX = '/api/admin';
const ADMIN_LOGIN = '/admin/login';

function buildSecurityHeaders(response: NextResponse): NextResponse {
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

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const isLogin =
    pathname === ADMIN_LOGIN || pathname.startsWith(`${ADMIN_LOGIN}/`);
  const isAdminApi = pathname.startsWith(ADMIN_API_PREFIX);
  const isAdminUi = pathname.startsWith(ADMIN_UI_PREFIX) && !isLogin;

  if (isLogin || isAdminUi || isAdminApi) {
    const response = NextResponse.next();
    // iron-session expects a CookieStore with both get() and set().
    // Read from the incoming request, mirror writes to the outgoing response
    // so any session-rotation cookie iron-session sets reaches the client.
    const cookieStore = {
      get(name: string) {
        const c = request.cookies.get(name);
        return c ? { name: c.name, value: c.value } : undefined;
      },
      set(...args: Parameters<typeof response.cookies.set>) {
        response.cookies.set(...args);
      },
    };
    const session = await getIronSession<AdminSessionData>(
      cookieStore,
      sessionOptions()
    );

    if (isLogin) {
      if (session.authenticated) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return buildSecurityHeaders(response);
    }

    if (!session.authenticated) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }

    return buildSecurityHeaders(response);
  }

  return buildSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
