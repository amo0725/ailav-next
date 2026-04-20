/* ── Site Constants ── */
/* Navigation, social, and UI timings. Editable content lives in src/lib/content. */

export const SITE_URL = 'https://ailav.com';

export const SOCIAL = {
  instagram: 'https://www.instagram.com/ailav_kaohsiung/',
  facebook: '#',
} as const;

export const LOADER_DURATION_MS = 3200;
export const LOADER_FALLBACK_MS = 6000;
export const WELCOME_SHOW_DELAY_MS = 3500;
export const WELCOME_HIDE_DELAY_MS = 12000;

export const NAV_LINKS = [
  { href: '#concept', zh: '理念', en: 'CONCEPT' },
  { href: '#chef', zh: '主廚', en: 'CHEF' },
  { href: '#menu', zh: '菜單', en: 'MENU' },
  { href: '#reserve', zh: '預約', en: 'RESERVATION' },
] as const;
