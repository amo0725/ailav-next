import Link from 'next/link';
import type { MenuCard } from '@/lib/content/types';
import MenuRenderer from '@/components/menu/MenuRenderer';

/* Homepage second menu band — large printed-card aesthetic for each
 * MenuCard. Sits right after MenuSection (the 3 session glass cards),
 * so the natural scroll flow is:
 *   intro/sessions → full menu cards → reservation
 * Each card carries its own background colour, so this wrapping
 * section uses --bg (clean) to let the cards pop.
 */
export default function MenuCardsSection({ cards }: { cards: MenuCard[] }) {
  if (cards.length === 0) return null;

  return (
    <section
      className="relative z-[7] bg-[var(--bg)] px-[var(--gutter)] py-[clamp(60px,10vw,140px)]"
      id="menu-cards"
    >
      <div className="mx-auto max-w-[920px]">
        <div className="text-center mb-12">
          <span className="rv block text-[clamp(.7rem,.9vw,.8rem)] tracking-[.35em] uppercase text-[var(--fg3)] mb-5">
            Full Menu
          </span>
          <h2 className="rv rv-d1 [font-family:var(--serif)] text-[clamp(1.7rem,3.6vw,2.6rem)] font-light leading-[1.3]">
            本月完整菜單
          </h2>
        </div>

        <div className="flex flex-col gap-[clamp(40px,7vw,80px)]">
          {cards.map((card, i) => (
            <div
              key={card.id}
              id={card.slug}
              className={`rv rv-d${(i % 4) + 1}`}
            >
              <MenuRenderer card={card} />
            </div>
          ))}
        </div>

        <div className="text-center mt-[clamp(40px,6vw,72px)] rv rv-d3">
          <Link href="/menu/print" className="cta">
            <span>列印 / 存 PDF</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
