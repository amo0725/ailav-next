import Image from 'next/image';

export default function ConceptSection() {
  return (
    <section
      className="relative z-[6] bg-[var(--bg)] px-[var(--gutter)] py-[clamp(80px,12vw,180px)]"
      id="concept"
    >
      <div className="mx-auto max-w-[var(--max)] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[clamp(60px,8vw,140px)] items-center">
        <div>
          <span className="rv block text-[clamp(.7rem,.9vw,.8rem)] tracking-[.35em] uppercase text-[var(--fg3)] mb-5">
            Concept
          </span>
          <h2 className="rv rv-d1 [font-family:var(--serif)] text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.3]">
            每一道菜品，<br />都是一次與土地的對話
          </h2>
          <p className="rv rv-d2 text-[var(--fg2)] leading-[2] mt-7">
            AILAV，唸作「I Love」——Aile &middot; Il a &middot; Voyage。
            一位遷徙主廚以風味與愛為羅盤，在世界各地的廚房裡淬煉出屬於亞洲的當代味覺語言。
          </p>
          <p className="rv rv-d3 text-[var(--fg2)] leading-[2] mt-3.5">
            與季節對話、與食客對話。我們追求的不僅是味覺的感動，
            更是餐桌上的文化共鳴。
          </p>
        </div>
        <div className="concept-img img-rv rv relative aspect-[3/4]">
          <Image
            className="object-cover"
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fm=avif"
            alt="精選季節食材 高雄 AILAV"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
