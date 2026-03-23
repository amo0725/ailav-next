const FWD_WORDS = [
  { text: 'Tradition' }, { text: 'Aile', accent: true }, { text: 'Innovation' }, { text: 'Craftsmanship' },
  { text: 'Il a', accent: true }, { text: 'Seasonality' }, { text: 'Culture' }, { text: 'Voyage', accent: true },
  { text: 'Harmony' }, { text: 'Flavor' }, { text: 'Love', accent: true }, { text: 'Journey' },
];

const REV_WORDS = ['風味', '旅程', '季節', '工藝', '文化', '對話', '遷徙', '愛', '傳統', '革新', '和諧', '探索'];

const FWD_BASE = '[font-family:var(--serif)] text-[clamp(1.8rem,4.2vw,3.2rem)] font-light tracking-[.06em] pr-[clamp(32px,4vw,56px)] shrink-0 transition-opacity duration-500';
const FWD_NORMAL = `${FWD_BASE} text-[var(--fg)] opacity-[.12]`;
const FWD_ACCENT = `${FWD_BASE} accent text-[var(--accent)] opacity-[.35] italic`;
const REV_CLASS = '[font-family:var(--sans)] text-[clamp(1rem,2.2vw,1.6rem)] font-normal tracking-[.12em] uppercase text-[var(--fg)] pr-[clamp(32px,4vw,56px)] shrink-0 opacity-[.06] transition-opacity duration-500';

export default function MarqueeSection() {
  const fwdItems = [...FWD_WORDS, ...FWD_WORDS];
  const revItems = [...REV_WORDS, ...REV_WORDS];

  return (
    <div className="marq relative z-[6] bg-[var(--bg)] py-[clamp(32px,5vw,56px)] overflow-hidden" aria-hidden="true">
      <div className="marq-row fwd flex whitespace-nowrap will-change-transform">
        {fwdItems.map((w, i) => (
          <span key={i} className={w.accent ? FWD_ACCENT : FWD_NORMAL}>{w.text}</span>
        ))}
      </div>
      <div className="marq-row rev flex whitespace-nowrap will-change-transform mt-[clamp(8px,1.5vw,16px)]">
        {revItems.map((w, i) => (
          <span key={i} className={REV_CLASS}>{w}</span>
        ))}
      </div>
    </div>
  );
}
