import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Block crawlers from authoring surfaces and API routes at the
      // robots.txt layer. The /admin layout also sets `robots: { index: false }`
      // as defence-in-depth, but Disallow stops crawl earlier and is
      // independent of meta-tag delivery.
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
