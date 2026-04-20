'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getSession } from '@/lib/auth/session';
import { verifyPassword } from '@/lib/auth/password';
import { verifyTotp } from '@/lib/auth/totp';
import { checkLoginRateLimit } from '@/lib/auth/rate-limit';

export type LoginState = {
  error?: string;
  stage: 'password' | 'totp';
};

const PasswordSchema = z.object({ password: z.string().min(1).max(200) });
const TotpSchema = z.object({ code: z.string().min(6).max(10) });

const PASSWORD_STAGE_MAX_AGE_MS = 5 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for') ?? '';
  const ip = fwd.split(',')[0]?.trim() ?? '';
  return ip || h.get('x-real-ip') || 'unknown';
}

export async function loginPasswordAction(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const ip = await getClientIp();
  const limit = await checkLoginRateLimit(ip);
  if (!limit.allowed) {
    return { stage: 'password', error: '嘗試次數過多，請稍後再試。' };
  }

  const parsed = PasswordSchema.safeParse({
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { stage: 'password', error: '請輸入密碼。' };
  }

  const ok = await verifyPassword(parsed.data.password);
  if (!ok) {
    return { stage: 'password', error: '密碼錯誤。' };
  }

  const session = await getSession();
  session.stage = 'password';
  session.authenticated = false;
  session.issuedAt = Date.now();
  await session.save();
  return { stage: 'totp' };
}

export async function loginTotpAction(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const ip = await getClientIp();
  const limit = await checkLoginRateLimit(ip);
  if (!limit.allowed) {
    return { stage: 'totp', error: '嘗試次數過多，請稍後再試。' };
  }

  const session = await getSession();
  if (
    session.stage !== 'password' ||
    !session.issuedAt ||
    Date.now() - session.issuedAt > PASSWORD_STAGE_MAX_AGE_MS
  ) {
    await session.destroy();
    return { stage: 'password', error: '驗證階段已過期，請重新輸入密碼。' };
  }

  const parsed = TotpSchema.safeParse({ code: formData.get('code') });
  if (!parsed.success) {
    return { stage: 'totp', error: '請輸入 6 位數驗證碼。' };
  }

  if (!verifyTotp(parsed.data.code)) {
    return { stage: 'totp', error: '驗證碼錯誤。' };
  }

  session.authenticated = true;
  session.stage = 'totp';
  session.issuedAt = Date.now();
  await session.save();
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  await session.destroy();
  redirect('/admin/login');
}
