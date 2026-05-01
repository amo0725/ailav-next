import type { Metadata } from 'next';
import MenuRenderer from '@/components/menu/MenuRenderer';
import PrintTrigger from './PrintTrigger';
import { getContent } from '@/lib/content';

export const metadata: Metadata = {
  title: '菜單列印',
  robots: { index: false, follow: false },
};

export default async function MenuPrintPage() {
  const content = await getContent();
  const cards = content.menuCards;

  return (
    <main className="ailav-print-page">
      <PrintTrigger />
      <div className="ailav-print-bar">
        <p>準備好就按 <kbd>Ctrl/⌘ + P</kbd> 列印或儲存 PDF</p>
        <a href="/menu" className="ailav-menu-page-btn">← 返回菜單</a>
      </div>
      <div className="ailav-print-stack">
        {cards.map((card) => (
          <MenuRenderer key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
}
