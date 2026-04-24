type Props = {
  size?: number;
  className?: string;
};

// Logo viewBox is 400 × 590 — the mark + AILAV wordmark stacked vertically.
const ASPECT = 400 / 590;

/* Renders the official AILAV logo (`/images/logo.svg`) as a CSS mask
 * filled with `currentColor`. Inheriting from the menu theme means the
 * logo automatically picks up `--menu-fg` — no per-theme SVG variants
 * needed when an admin switches a card to a dark background later.
 */
export default function AilavMark({ size = 96, className }: Props) {
  const width = Math.round(size * ASPECT);
  return (
    <span
      role="img"
      aria-label="AILAV"
      className={className}
      style={{
        display: 'inline-block',
        width,
        height: size,
        backgroundColor: 'currentColor',
        WebkitMaskImage: 'url(/images/logo.svg)',
        maskImage: 'url(/images/logo.svg)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}
