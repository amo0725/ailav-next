import bcrypt from 'bcryptjs';
import { securityWarn } from '@/lib/log';

function resolveHash(): string | null {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (b64) {
    try {
      return Buffer.from(b64, 'base64').toString('utf8');
    } catch {
      return null;
    }
  }
  const raw = process.env.ADMIN_PASSWORD_HASH;
  return raw || null;
}

export async function verifyPassword(plain: string): Promise<boolean> {
  const hash = resolveHash();
  if (!hash || hash.length < 50 || !hash.startsWith('$2')) {
    securityWarn('admin password hash format invalid');
    return false;
  }
  if (!plain || typeof plain !== 'string') return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    securityWarn('bcrypt compare threw — treat as auth failure');
    return false;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
