import { getIronSession, type IronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type AdminSessionData = {
  authenticated?: boolean;
  stage?: 'password' | 'totp';
  issuedAt?: number;
};

export type AdminSession = IronSession<AdminSessionData>;

const DEFAULT_TTL_SECONDS = 60 * 60 * 8;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET env var is required and must be >= 32 characters'
    );
  }
  return secret;
}

export function sessionOptions(): SessionOptions {
  return {
    password: getSecret(),
    cookieName: 'ailav_admin',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: DEFAULT_TTL_SECONDS,
    },
    ttl: DEFAULT_TTL_SECONDS,
  };
}

export async function getSession(): Promise<AdminSession> {
  const store = await cookies();
  return getIronSession<AdminSessionData>(store, sessionOptions());
}

export async function requireAuthenticated(): Promise<AdminSession> {
  const session = await getSession();
  if (!session.authenticated) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
