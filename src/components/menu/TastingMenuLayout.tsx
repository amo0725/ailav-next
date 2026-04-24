import FocalImage from '@/components/common/FocalImage';
import type { TastingMenuCard } from '@/lib/content/types';
import { srcOf } from '@/lib/content/image';
import AilavMark from './AilavMark';

/* Reproduces the terracotta tasting-menu card:
 *  - Centered logo at top
 *  - Course sections (heading in spaced caps, ZH item names, EN italic)
 *  - Optional dish photos under each item
 *  - Centered footnote at the bottom
 * Theme colors come in via CSS custom properties from the parent.
 */
export default function TastingMenuLayout({ card }: { card: TastingMenuCard }) {
  return (
    <article className="ailav-menu ailav-menu-tasting">
      <header className="ailav-menu-head">
        <AilavMark size={110} />
      </header>

      <div className="ailav-menu-body">
        {card.courses.map((course) => (
          <section key={course.id} className="ailav-course">
            <h3 className="ailav-course-heading">{course.heading}</h3>
            {course.items.map((item) => (
              <div key={item.id} className="ailav-item">
                {item.titleZh && (
                  <p className="ailav-item-zh">{item.titleZh}</p>
                )}
                {item.titleEn && (
                  <p className="ailav-item-en">{item.titleEn}</p>
                )}
                {srcOf(item.image) && (
                  <div className="ailav-item-image">
                    <FocalImage
                      asset={item.image || undefined}
                      fallbackAlt={item.titleZh || item.titleEn || 'dish'}
                      width={640}
                      height={640}
                      sizes="(max-width: 700px) 90vw, 460px"
                    />
                  </div>
                )}
                {item.note && <p className="ailav-item-note">{item.note}</p>}
              </div>
            ))}
          </section>
        ))}
      </div>

      {(card.subtitle || card.footnote) && (
        <footer className="ailav-menu-foot">
          {card.subtitle && <h4 className="ailav-menu-subtitle">{card.subtitle}</h4>}
          {card.footnote && <p className="ailav-menu-footnote">{card.footnote}</p>}
        </footer>
      )}
    </article>
  );
}
