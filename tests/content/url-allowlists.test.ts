import { describe, expect, it } from 'vitest';
import { isAllowedMapUrl } from '@/lib/content/map-url';
import {
  isAllowedReservationUrl,
  safeReservationUrl,
} from '@/lib/content/reservation-url';

describe('isAllowedMapUrl (iframe src allow-list)', () => {
  it.each([
    'https://www.google.com/maps/embed?pb=!1m18',
    'https://maps.google.com/maps/embed?pb=abc',
    'https://www.google.com.tw/maps/embed/v1/place?q=Kaohsiung',
  ])('accepts Google Maps embed URL %s', (url) => {
    expect(isAllowedMapUrl(url)).toBe(true);
  });

  it.each([
    ['plain http', 'http://www.google.com/maps/embed?pb=1'],
    ['non-embed Google path', 'https://www.google.com/search?q=x'],
    ['lookalike host', 'https://www.google.com.evil.example/maps/embed'],
    ['Google URL smuggled in the query', 'https://evil.example/?u=https://www.google.com/maps/embed'],
    ['javascript scheme', 'javascript:alert(1)'],
    ['data URL', 'data:text/html,<script>alert(1)</script>'],
    ['not a URL', 'maps embed please'],
    ['empty', ''],
  ])('rejects %s', (_label, url) => {
    expect(isAllowedMapUrl(url)).toBe(false);
  });
});

describe('reservation URL guard (<a href> allow-list)', () => {
  it.each(['https://inline.app/booking/ailav', 'http://example.com/reserve'])(
    'accepts http(s) URL %s',
    (url) => {
      expect(isAllowedReservationUrl(url)).toBe(true);
      expect(safeReservationUrl(url)).toBe(url);
    }
  );

  it.each([
    'javascript:alert(document.cookie)',
    'JaVaScRiPt:alert(1)',
    'data:text/html;base64,PHNjcmlwdD4=',
    'vbscript:msgbox(1)',
    'mailto:someone@example.com',
    'not a url',
  ])('rejects %s', (url) => {
    expect(isAllowedReservationUrl(url)).toBe(false);
    expect(safeReservationUrl(url)).toBeNull();
  });

  it.each([undefined, null, ''])('returns null for empty input (%s)', (v) => {
    expect(safeReservationUrl(v)).toBeNull();
  });
});
