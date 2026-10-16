import bcrypt from 'bcryptjs';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

// Low cost factor keeps the suite fast; verifyPassword reads the cost from the hash.
let HASH: string;
const PASSWORD = 'correct horse battery staple';

beforeAll(async () => {
  HASH = await bcrypt.hash(PASSWORD, 4);
});

beforeEach(() => {
  // Silence the expected security warnings for malformed-hash cases.
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.stubEnv('ADMIN_PASSWORD_HASH_B64', '');
  vi.stubEnv('ADMIN_PASSWORD_HASH', '');
});

describe('verifyPassword', () => {
  it('accepts the correct password against ADMIN_PASSWORD_HASH', async () => {
    vi.stubEnv('ADMIN_PASSWORD_HASH', HASH);
    await expect(verifyPassword(PASSWORD)).resolves.toBe(true);
  });

  it('rejects a wrong password', async () => {
    vi.stubEnv('ADMIN_PASSWORD_HASH', HASH);
    await expect(verifyPassword('correct horse battery stapler')).resolves.toBe(false);
    await expect(verifyPassword('')).resolves.toBe(false);
  });

  it('prefers ADMIN_PASSWORD_HASH_B64 (avoids $ mangling in env files)', async () => {
    const other = await bcrypt.hash('another password', 4);
    vi.stubEnv('ADMIN_PASSWORD_HASH', other);
    vi.stubEnv('ADMIN_PASSWORD_HASH_B64', Buffer.from(HASH, 'utf8').toString('base64'));

    await expect(verifyPassword(PASSWORD)).resolves.toBe(true);
    await expect(verifyPassword('another password')).resolves.toBe(false);
  });

  it.each([
    ['missing', ''],
    ['not a bcrypt hash', 'x'.repeat(60)],
    ['truncated bcrypt hash', '$2b$04$tooShort'],
  ])('fails closed when the configured hash is %s', async (_label, hash) => {
    vi.stubEnv('ADMIN_PASSWORD_HASH', hash);
    await expect(verifyPassword(PASSWORD)).resolves.toBe(false);
    expect(console.warn).toHaveBeenCalledWith(
      '[security]',
      'admin password hash format invalid'
    );
  });
});

describe('hashPassword', () => {
  it('produces a cost-12 bcrypt hash that verifies', async () => {
    const hash = await hashPassword('s3cret-pass');
    expect(hash).toMatch(/^\$2[aby]\$12\$/);
    await expect(bcrypt.compare('s3cret-pass', hash)).resolves.toBe(true);
  });
});
