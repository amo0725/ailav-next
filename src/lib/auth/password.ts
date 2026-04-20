import bcrypt from 'bcryptjs';

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
    console.error('[auth] hash format invalid');
    return false;
  }
  if (!plain || typeof plain !== 'string') return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    console.error('[auth] bcrypt compare failed');
    return false;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
