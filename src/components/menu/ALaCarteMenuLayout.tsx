import FocalImage from '@/components/common/FocalImage';
import type { ALaCarteMenuCard } from '@/lib/content/types';
import { srcOf } from '@/lib/content/image';
import AilavMark from './AilavMark';

/* Reproduces the olive after-hours card:
 *  - Centered logo
 *  - Bold ZH title + italic EN subtitle
 *  - Item rows: ZH on top, EN italic below, price right-aligned and
 *    visually separate (matches the source design's alignment)
 *  - Optional dish photos
 */
export default function ALaCarteMenuLayout({ card }: { card: ALaCarteMenuCard }) {
  return (
    <article className="ailav-menu ailav-menu-alacarte">
      <header className="ailav-menu-head">
        <AilavMark size={110} />
        {card.name && <h2 className="ailav-menu-title">{card.name}</h2>}
        {card.subtitle && <h3 className="ailav-menu-subtitle">{card.subtitle}</h3>}
      </header>

      <div className="ailav-menu-body">
        {card.items.map((item) => (
          <div key={item.id} className="ailav-row">
            <div className="ailav-row-text">
              {item.titleZh && <p className="ailav-item-zh">{item.titleZh}</p>}
              {item.titleEn && <p className="ailav-item-en">{item.titleEn}</p>}
              {item.note && <p className="ailav-item-note">{item.note}</p>}
            </div>
            {item.price && <span className="ailav-row-price">{item.price}</span>}
            {srcOf(item.image) && (
              <div className="ailav-row-image">
                <FocalImage
                  asset={item.image || undefined}
                  fallbackAlt={item.titleZh || item.titleEn || 'dish'}
                  width={480}
                  height={480}
                  sizes="(max-width: 700px) 80vw, 280px"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {card.footnote && (
        <footer className="ailav-menu-foot">
          <p className="ailav-menu-footnote">{card.footnote}</p>
        </footer>
      )}
    </article>
  );
}
