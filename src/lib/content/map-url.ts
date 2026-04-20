/**
 * Allow-list for the Reservation section's embedded map URL.
 *
 * Only Google Maps `/maps/embed` URLs are accepted — a compromised admin
 * cannot swap in an arbitrary iframe source (defense-in-depth for the CSP
 * `frame-src` directive in src/proxy.ts).
 */
const ALLOWED_HOSTS = new Set([
  'www.google.com',
  'maps.google.com',
  'www.google.com.tw',
]);

export function isAllowedMapUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  if (!ALLOWED_HOSTS.has(url.hostname)) return false;
  if (!url.pathname.startsWith('/maps/embed')) return false;
  return true;
}
