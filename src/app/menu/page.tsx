import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MenuRenderer from '@/components/menu/MenuRenderer';
import { getContent } from '@/lib/content';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: '菜單',
  description:
    'AILAV 高雄精緻餐廳當季菜單。品味套餐 NT$990 / 主食套餐之夜 / 深夜 Wine Bar 單點。融合台、法、日風味的當代創作料理，位於高雄三民區民壯路。可一鍵列印或儲存 PDF。',
  alternates: { canonical: '/menu' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '菜單', item: `${SITE_URL}/menu` },
  ],
};

export default async function MenuIndexPage() {
  const content = await getContent();
  const cards = content.menuCards;
  const breadcrumbSafe = JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSafe }}
      />
      <Header social={content.site.social} />
      <main id="main" className="ailav-menu-page">
        <div className="ailav-menu-page-head">
          <span className="ailav-menu-page-eyebrow">Menu</span>
          <h1 className="ailav-menu-page-title">當季菜單</h1>
          <p className="ailav-menu-page-sub">
            點擊「列印」可儲存為 PDF 帶走或寄給朋友。
          </p>
          <div className="ailav-menu-page-actions">
            <Link href="/menu/print" className="ailav-menu-page-btn">
              列印 / 存成 PDF
            </Link>
          </div>
        </div>

        {cards.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--fg2)' }}>
            目前尚未建立任何菜單卡。
          </p>
        ) : (
          <div className="ailav-menu-page-stack">
            {cards.map((card) => (
              <section key={card.id} id={card.slug} className="ailav-menu-page-item">
                <MenuRenderer card={card} />
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer tagline={content.site.tagline} social={content.site.social} />
    </>
  );
}
