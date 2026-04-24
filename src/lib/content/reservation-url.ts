/**
 * Validation for the admin-supplied "Online Reservation" CTA URL.
 *
 * Even with 2FA admin auth, an admin-controlled string that ends up in
 * `<a href={…}>` is a phishing / XSS surface. We restrict it to `http://`
 * and `https://` schemes — `z.string().url()` alone allows `javascript:`,
 * `data:`, `vbscript:`, etc. which would execute code on click.
 *
 * Mirrors the pattern in `map-url.ts` (single-purpose URL allow-list,
 * imported by both the schema and the renderer for defence in depth).
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

/** True for a syntactically-valid http(s) URL. Empty string is NOT allowed
 *  here — handle it at the schema level (`z.literal('') | z.string().refine(…)`). */
export function isAllowedReservationUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  return ALLOWED_PROTOCOLS.has(url.protocol);
}

/** Render-time guard. Returns the URL if safe, or `null` so the caller can
 *  hide the CTA / fall back to `href="#"`. */
export function safeReservationUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  return isAllowedReservationUrl(raw) ? raw : null;
}
