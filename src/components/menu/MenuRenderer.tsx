import type { MenuCard } from '@/lib/content/types';
import TastingMenuLayout from './TastingMenuLayout';
import ALaCarteMenuLayout from './ALaCarteMenuLayout';

/* Strategy dispatch — adding a new menu kind means adding one case here
 * and one new <Layout> component. No other call site changes.
 */
export default function MenuRenderer({ card }: { card: MenuCard }) {
  // Theme colors are exposed as CSS variables so the printed-card aesthetic
  // is fully data-driven — every selector inside the layouts reads from
  // these vars instead of hardcoded values.
  const themeStyle = {
    '--menu-bg': card.theme.bg,
    '--menu-fg': card.theme.fg,
    '--menu-accent': card.theme.accent,
  } as React.CSSProperties;

  return (
    <div className="ailav-menu-frame" style={themeStyle} data-menu-slug={card.slug}>
      {card.kind === 'tasting' ? (
        <TastingMenuLayout card={card} />
      ) : (
        <ALaCarteMenuLayout card={card} />
      )}
    </div>
  );
}
