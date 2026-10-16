import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Secret, TOTP, URI } from 'otpauth';
import { generateTotpSecret, verifyTotp } from '@/lib/auth/totp';

// Fixed RFC 6238 test secret ("12345678901234567890" as base32).
const SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
const PERIOD_MS = 30_000;
// A timestamp aligned to the start of a 30 s step, so edge offsets are exact.
const STEP_START = PERIOD_MS * 56_666_667; // 2023-11-14T22:13:30.000Z

function codeAt(timestamp: number, secret = SECRET): string {
  return TOTP.generate({
    secret: Secret.fromBase32(secret),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    timestamp,
  });
}

function at(timestamp: number) {
  vi.setSystemTime(timestamp);
}

describe('verifyTotp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv('ADMIN_TOTP_SECRET', SECRET);
    at(STEP_START);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('accepts the code for the current time step', () => {
    expect(verifyTotp(codeAt(STEP_START))).toBe(true);
  });

  it('tolerates whitespace inside the code (e.g. "123 456")', () => {
    const code = codeAt(STEP_START);
    expect(verifyTotp(`${code.slice(0, 3)} ${code.slice(3)}`)).toBe(true);
  });

  it('rejects a wrong code', () => {
    const code = codeAt(STEP_START);
    const wrong = String((Number(code) + 1) % 1_000_000).padStart(6, '0');
    expect(verifyTotp(wrong)).toBe(false);
  });

  it('rejects a code generated from a different secret', () => {
    const other = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';
    expect(verifyTotp(codeAt(STEP_START, other))).toBe(false);
  });

  it.each([
    ['empty string', ''],
    ['too short', '12345'],
    ['too long', '1234567'],
    ['non-numeric', 'abcdef'],
  ])('rejects malformed input: %s', (_label, input) => {
    expect(verifyTotp(input)).toBe(false);
  });

  it('rejects non-string input at runtime', () => {
    expect(verifyTotp(123456 as unknown as string)).toBe(false);
  });

  describe('time-window edges (window = 1 step either side)', () => {
    const code = () => codeAt(STEP_START);

    it('still valid at the last millisecond of its own step', () => {
      at(STEP_START + PERIOD_MS - 1);
      expect(verifyTotp(code())).toBe(true);
    });

    it('valid one step later (clock drift / slow typist)', () => {
      at(STEP_START + PERIOD_MS);
      expect(verifyTotp(code())).toBe(true);
      at(STEP_START + 2 * PERIOD_MS - 1);
      expect(verifyTotp(code())).toBe(true);
    });

    it('expired two steps later', () => {
      at(STEP_START + 2 * PERIOD_MS);
      expect(verifyTotp(code())).toBe(false);
    });

    it('valid one step earlier (server clock behind)', () => {
      at(STEP_START - PERIOD_MS);
      expect(verifyTotp(code())).toBe(true);
    });

    it('rejected two steps earlier', () => {
      at(STEP_START - PERIOD_MS - 1);
      expect(verifyTotp(code())).toBe(false);
    });
  });

  it('fails closed when ADMIN_TOTP_SECRET is not configured', () => {
    vi.stubEnv('ADMIN_TOTP_SECRET', '');
    expect(verifyTotp(codeAt(STEP_START))).toBe(false);
  });

  it('fails closed (no throw) when the configured secret is not valid base32', () => {
    vi.stubEnv('ADMIN_TOTP_SECRET', 'not-base32-!!!');
    expect(() => verifyTotp('123456')).not.toThrow();
    expect(verifyTotp('123456')).toBe(false);
  });
});

describe('generateTotpSecret', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a 160-bit base32 secret and a matching otpauth:// URI', () => {
    const { secret, uri } = generateTotpSecret();

    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
    expect(Secret.fromBase32(secret).bytes).toHaveLength(20);

    const parsed = URI.parse(uri);
    expect(parsed).toBeInstanceOf(TOTP);
    const totp = parsed as TOTP;
    expect(totp.issuer).toBe('AILAV Admin');
    expect(totp.label).toBe('admin');
    expect(totp.algorithm).toBe('SHA1');
    expect(totp.digits).toBe(6);
    expect(totp.period).toBe(30);
    expect(totp.secret.base32).toBe(secret);
  });

  it('produces a fresh secret on every call', () => {
    expect(generateTotpSecret().secret).not.toBe(generateTotpSecret().secret);
  });

  it('round-trips: a code from the enrolled URI verifies against the stored secret', () => {
    vi.useFakeTimers();
    vi.setSystemTime(STEP_START);
    const { secret, uri } = generateTotpSecret();
    vi.stubEnv('ADMIN_TOTP_SECRET', secret);

    const authenticatorCode = (URI.parse(uri) as TOTP).generate();
    expect(verifyTotp(authenticatorCode)).toBe(true);
  });
});
