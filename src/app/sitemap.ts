import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ailav.com',
      lastModified: new Date('2026-03-24'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
