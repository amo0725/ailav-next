import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Noto_Serif_TC } from 'next/font/google';
import { getContent } from '@/lib/content';
import type { Chef, MenuCard, MenuItem } from '@/lib/content/types';
import { SITE_URL } from '@/lib/constants';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

// Noto Serif TC ships as ~100 unicode-range shards; the browser only
// downloads the shards containing characters actually rendered on the page,
// which means CMS-edited content never falls back to a system font for
// missing glyphs (the issue with our previous build-time pyftsubset).
const notoSerifTC = Noto_Serif_TC({
  weight: ['300', '400'],
  preload: false,
  display: 'swap',
  variable: '--font-noto-serif-tc',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  display: 'swap',
  variable: '--font-inter',
});

/* ── SEO Metadata ── */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AILAV — 高雄精緻餐廳 | 台法日融合當代料理',
    template: '%s | AILAV',
  },
  description:
    "AILAV — 高雄三民區精緻餐廳，主廚廖冠宇（Ryo Liao）與黃恆毅（Henry Huang）以橫跨日、法、台的技術詮釋當代料理。品味套餐 NT$990／位、深夜 Wine Bar 單點。Pronounced as 'I Love'。",
  keywords: [
    'AILAV',
    '高雄餐廳',
    '高雄精緻餐廳',
    '高雄三民區餐廳',
    '台法日融合',
    '當代料理',
    '高雄米其林推薦',
    '精緻餐飲',
    'fine dining',
    'Kaohsiung',
    'Asian fusion',
  ],
  authors: [{ name: 'AILAV' }],
  creator: 'AILAV',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: SITE_URL,
    siteName: 'AILAV',
    title: 'AILAV — 高雄精緻餐廳 | 台法日融合當代料理',
    description: '高雄三民區精緻餐飲，融合台、法、日風味的當代料理體驗。Aile · Il a · Voyage.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AILAV — 高雄精緻餐廳',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AILAV — 高雄精緻餐廳 | 台法日融合當代料理',
    description: '高雄三民區精緻餐飲，融合台、法、日風味的當代料理體驗。',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'AILAV',
  },
};

/* ── JSON-LD Structured Data ── */
// Parse a Taiwan postal address like "807 高雄市三民區民壯路 39 號" into
// schema.org PostalAddress fields. Returns the structured form when the
// pattern matches; otherwise falls back to using the full string as
// `streetAddress` so the JSON-LD never breaks on edge inputs.
function parseTwAddress(full: string): {
  postalCode?: string;
  addressRegion?: string;
  addressLocality?: string;
  streetAddress: string;
} {
  const trimmed = full.trim();
  const match = trimmed.match(/^(\d{3,5})\s*(.+?[市縣])\s*(.+?[區鄉鎮])\s*(.+)$/);
  if (!match) return { streetAddress: trimmed };
  return {
    postalCode: match[1],
    addressRegion: match[2],
    addressLocality: match[3],
    streetAddress: match[4].trim(),
  };
}

function priceFromString(price: string): { value: string; currency: string } | null {
  if (!price) return null;
  const match = price.match(/(\d[\d,.]*)/);
  if (!match) return null;
  return {
    value: match[1].replace(/,/g, ''),
    currency: 'TWD',
  };
}

function buildMenuLd(menu: MenuItem[], cards: MenuCard[]) {
  // Detailed dish list (richer SEO data) — drawn from the printed-style cards.
  const cardSections = cards.map((card) => {
    const items =
      card.kind === 'tasting'
        ? card.courses.flatMap((c) =>
            c.items.map((it) => ({
              '@type': 'MenuItem' as const,
              name: it.titleZh || it.titleEn,
              ...(it.titleEn ? { description: it.titleEn } : {}),
            }))
          )
        : card.items.map((it) => {
            const price = priceFromString(it.price);
            return {
              '@type': 'MenuItem' as const,
              name: it.titleZh || it.titleEn,
              ...(it.titleEn ? { description: it.titleEn } : {}),
              ...(price
                ? {
                    offers: {
                      '@type': 'Offer',
                      price: price.value,
                      priceCurrency: price.currency,
                    },
                  }
                : {}),
            };
          });
    return {
      '@type': 'MenuSection' as const,
      name: card.name,
      hasMenuItem: items,
    };
  });

  // Session overview (from homepage menu) — gives Google the per-session price.
  const sessionSections = menu.map((it) => {
    const price = priceFromString(it.price);
    return {
      '@type': 'MenuSection' as const,
      name: it.title,
      ...(it.description ? { description: it.description } : {}),
      hasMenuItem: {
        '@type': 'MenuItem' as const,
        name: it.title,
        ...(it.description ? { description: it.description } : {}),
        ...(price
          ? {
              offers: {
                '@type': 'Offer',
                price: price.value,
                priceCurrency: price.currency,
              },
            }
          : {}),
      },
    };
  });

  return {
    '@type': 'Menu',
    hasMenuSection: [...cardSections, ...sessionSections],
  };
}

function buildJsonLd(
  menu: MenuItem[],
  cards: MenuCard[],
  social: { instagram: string; facebook: string },
  telephone: string | undefined,
  chefs: Chef[],
  address: string,
  geo: { lat: number; lng: number }
) {
  const parsed = parseTwAddress(address);
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'AILAV',
    description: "Pronounced as 'I Love'. A migratory chef's journey of flavor and love.",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    image: `${SITE_URL}/images/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: parsed.streetAddress,
      ...(parsed.addressLocality ? { addressLocality: parsed.addressLocality } : {}),
      ...(parsed.addressRegion ? { addressRegion: parsed.addressRegion } : {}),
      ...(parsed.postalCode ? { postalCode: parsed.postalCode } : {}),
      addressCountry: 'TW',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.lat,
      longitude: geo.lng,
    },
    // E.164-formatted phone surfaces in Knowledge Panel and SERP cards.
    // Falsy → omitted; schema.org allows the field to be absent.
    ...(telephone ? { telephone } : {}),
    priceRange: '$$',
    // Mixed locale list — English helps international SERPs, Chinese
    // helps zh-TW long-tail searches like 「高雄台法料理」.
    servesCuisine: [
      'Asian Fusion',
      'Contemporary',
      'French-Asian',
      '台法日融合',
      '精緻餐飲',
      '當代料理',
    ],
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
    sameAs: [social.instagram, social.facebook].filter(Boolean),
    // Surface chef personal brand searches (e.g. 「Ryo Liao 主廚」).
    // schema.org Restaurant.employee accepts Person[].
    employee: chefs.map((chef) => ({ '@type': 'Person', name: chef.name })),
    hasMenu: buildMenuLd(menu, cards),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();
  const jsonLd = buildJsonLd(
    content.menu,
    content.menuCards,
    content.site.social,
    content.restaurant.telephone,
    content.chefs,
    content.restaurant.address,
    { lat: content.restaurant.lat, lng: content.restaurant.lng },
  );
  // Escape `<` so admin-supplied content (menu names, dish titles) cannot
  // break out of the inline <script> tag with `</script><script>…`.
  // < parses back to `<` for any JSON-LD consumer — structured data
  // semantics are unchanged.
  const jsonLdSafe = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
  return (
    <html lang="zh-Hant-TW" data-theme="light" className={`${cormorant.variable} ${notoSerifTC.variable} ${inter.variable}`}>
      <head>
        {/* JSON-LD — raw <script> in <head> so it lands in the SSR HTML
            (Googlebot can read it on first request without executing JS).
            next/script defaults to afterInteractive, which would defer
            injection until hydration. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdSafe }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
