import { TOTP, Secret } from 'otpauth';

const ISSUER = 'AILAV Admin';
const LABEL = 'admin';
const PERIOD = 30;
const DIGITS = 6;
const ALGORITHM = 'SHA1';
const WINDOW = 1;

function buildTotp(secret: string): TOTP {
  return new TOTP({
    issuer: ISSUER,
    label: LABEL,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: Secret.fromBase32(secret),
  });
}

export function verifyTotp(code: string): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return false;
  if (!code || typeof code !== 'string') return false;
  const cleaned = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(cleaned)) return false;
  try {
    const totp = buildTotp(secret);
    const delta = totp.validate({ token: cleaned, window: WINDOW });
    return delta !== null;
  } catch {
    return false;
  }
}

export function generateTotpSecret(): { secret: string; uri: string } {
  const secret = new Secret({ size: 20 });
  const totp = new TOTP({
    issuer: ISSUER,
    label: LABEL,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret,
  });
  return { secret: secret.base32, uri: totp.toString() };
}
