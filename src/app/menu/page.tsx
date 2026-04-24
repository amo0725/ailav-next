import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MenuRenderer from '@/components/menu/MenuRenderer';
import { getContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Menu — AILAV',
  description: 'AILAV 當季套餐與宵夜時段菜單。',
};

export default async function MenuIndexPage() {
  const content = await getContent();
  const cards = content.menuCards;

  return (
    <>
      <Header />
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
      <Footer tagline={content.site.tagline} />
    </>
  );
}
