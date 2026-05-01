import type { MetadataRoute } from 'next';

const SITE_URL = 'https://ailav.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // lastModified bumped each release; admin-driven content changes are
  // surfaced via JSON-LD + the /menu route, not via per-update sitemap pings.
  const lastModified = new Date('2026-05-01');
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/menu`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
