import { MANIFESTO_WORDS, MANIFESTO_VIDEO_URL } from '@/lib/constants';

export default function ManifestoSection() {
  return (
    <section
      className="relative z-[6] bg-[var(--bg)] px-[var(--gutter)] py-[clamp(80px,12vw,160px)]"
      id="ambientSect"
      aria-label="品牌宣言"
    >
      <div className="mx-auto max-w-[var(--max)] flex flex-col items-center">
        {/* Video */}
        <div className="rv relative w-full aspect-[2.2/1] rounded-[10px] overflow-hidden mb-[clamp(60px,8vw,110px)]">
          <video
            className="w-full h-full object-cover brightness-[.4] saturate-50"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1280&q=60&auto=format"
            aria-label="AILAV 品牌影片"
          >
            <source src={MANIFESTO_VIDEO_URL} type="video/mp4" />
          </video>
          <div className="absolute inset-0 z-[2] flex items-center justify-center px-[var(--gutter)]">
            <p className="[font-family:var(--serif)] text-[clamp(.8rem,1.3vw,.95rem)] tracking-[.3em] uppercase text-white/55 text-center">
              A migratory chef&apos;s journey of flavor &amp; love
            </p>
          </div>
        </div>

        {/* Triptych */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center w-full max-w-[880px] gap-0">
          <div className="mani-col rv text-center px-[clamp(16px,3vw,36px)] py-[clamp(20px,3vw,40px)]" data-mani="0">
            <div className="fr [font-family:var(--serif)] text-[clamp(2rem,4.5vw,3.6rem)] font-light italic tracking-[.1em] text-[var(--fg)] opacity-10 transition-opacity duration-1000">
              {MANIFESTO_WORDS[0].fr}
            </div>
            <div className="text-[clamp(.68rem,.9vw,.78rem)] tracking-[.3em] uppercase text-[var(--fg3)] mt-3 leading-[1.7]">
              {MANIFESTO_WORDS[0].en}
            </div>
            <span className="block [font-family:var(--serif)] text-[clamp(.85rem,1.1vw,1rem)] tracking-[.08em] text-[var(--fg2)] mt-1.5 italic">
              {MANIFESTO_WORDS[0].zh}
            </span>
          </div>

          <div
            className="mani-divider rv rv-d1 hidden sm:block w-px h-0 bg-[var(--accent)] opacity-20 self-stretch my-5"
            data-mani-line="0"
          ></div>
          {/* Mobile divider */}
          <div className="mani-divider rv rv-d1 sm:hidden w-10 h-px mx-auto my-2 bg-[var(--accent)] opacity-15"></div>

          <div className="mani-col rv rv-d2 text-center px-[clamp(16px,3vw,36px)] py-[clamp(20px,3vw,40px)]" data-mani="1">
            <div className="fr [font-family:var(--serif)] text-[clamp(2rem,4.5vw,3.6rem)] font-light italic tracking-[.1em] text-[var(--fg)] opacity-10 transition-opacity duration-1000">
              {MANIFESTO_WORDS[1].fr}
            </div>
            <div className="text-[clamp(.68rem,.9vw,.78rem)] tracking-[.3em] uppercase text-[var(--fg3)] mt-3 leading-[1.7]">
              {MANIFESTO_WORDS[1].en}
            </div>
            <span className="block [font-family:var(--serif)] text-[clamp(.85rem,1.1vw,1rem)] tracking-[.08em] text-[var(--fg2)] mt-1.5 italic">
              {MANIFESTO_WORDS[1].zh}
            </span>
          </div>

          <div
            className="mani-divider rv rv-d3 hidden sm:block w-px h-0 bg-[var(--accent)] opacity-20 self-stretch my-5"
            data-mani-line="1"
          ></div>
          <div className="mani-divider rv rv-d3 sm:hidden w-10 h-px mx-auto my-2 bg-[var(--accent)] opacity-15"></div>

          <div className="mani-col rv rv-d4 text-center px-[clamp(16px,3vw,36px)] py-[clamp(20px,3vw,40px)]" data-mani="2">
            <div className="fr [font-family:var(--serif)] text-[clamp(2rem,4.5vw,3.6rem)] font-light italic tracking-[.1em] text-[var(--fg)] opacity-10 transition-opacity duration-1000">
              {MANIFESTO_WORDS[2].fr}
            </div>
            <div className="text-[clamp(.68rem,.9vw,.78rem)] tracking-[.3em] uppercase text-[var(--fg3)] mt-3 leading-[1.7]">
              {MANIFESTO_WORDS[2].en}
            </div>
            <span className="block [font-family:var(--serif)] text-[clamp(.85rem,1.1vw,1rem)] tracking-[.08em] text-[var(--fg2)] mt-1.5 italic">
              {MANIFESTO_WORDS[2].zh}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
