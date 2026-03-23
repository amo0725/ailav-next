import type { Metadata } from 'next';
import './globals.css';

/* ── SEO Metadata ── */
const SITE_URL = 'https://ailav.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AILAV — A Journey of Taste',
  description:
    "AILAV — Pronounced as 'I Love'. A migratory chef's journey of flavor and love. 高雄精緻餐飲。",
  keywords: ['AILAV', '高雄餐廳', '精緻餐飲', 'fine dining', 'Kaohsiung', 'Asian fusion'],
  authors: [{ name: 'AILAV' }],
  creator: 'AILAV',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: SITE_URL,
    siteName: 'AILAV',
    title: 'AILAV — A Migratory Chef\'s Journey of Flavor & Love',
    description: '高雄精緻餐飲，融合亞洲風味的當代料理體驗。Aile · Il a · Voyage.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AILAV Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AILAV — A Journey of Taste',
    description: '高雄精緻餐飲，融合亞洲風味的當代料理體驗。',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ── JSON-LD Structured Data ── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'AILAV',
  description: "Pronounced as 'I Love'. A migratory chef's journey of flavor and love.",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.svg`,
  image: `${SITE_URL}/images/og-image.jpg`,
  telephone: '',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '民壯路43號',
    addressLocality: '三民區',
    addressRegion: '高雄市',
    postalCode: '807',
    addressCountry: 'TW',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 22.639763,
    longitude: 120.340723,
  },
  priceRange: '$$',
  servesCuisine: ['Asian Fusion', 'Contemporary', 'French-Asian'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '15:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '18:30',
      closes: '22:30',
    },
  ],
  sameAs: ['https://www.instagram.com/ailav_kaohsiung/'],
  hasMenu: {
    '@type': 'Menu',
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: '午間套餐',
        hasMenuItem: {
          '@type': 'MenuItem',
          name: '午間套餐',
          offers: { '@type': 'Offer', price: '980', priceCurrency: 'TWD' },
        },
      },
      {
        '@type': 'MenuSection',
        name: '晚間套餐',
        hasMenuItem: {
          '@type': 'MenuItem',
          name: '晚間套餐',
          offers: { '@type': 'Offer', price: '1280', priceCurrency: 'TWD' },
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" data-theme="light">
      <head>
        {/* Google Fonts — loaded via <link> (CSS @import gets stripped by PostCSS) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Noto+Serif+TC:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* LCP Preload */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85&auto=format&fm=avif"
          fetchPriority="high"
        />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
