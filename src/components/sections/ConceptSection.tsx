import Image from 'next/image';
import type { Concept } from '@/lib/content/types';

function renderParagraph(text: string, key: number, delay: number) {
  return (
    <p
      key={key}
      className={`rv rv-d${delay} text-[var(--fg2)] leading-[2] ${key === 0 ? 'mt-7' : 'mt-3.5'} ${text.startsWith('「') ? 'italic [font-family:var(--serif)]' : ''}`}
    >
      {text}
    </p>
  );
}

export default function ConceptSection({ concept }: { concept: Concept }) {
  const [headingLine1, headingLine2] = concept.heading.includes('，')
    ? concept.heading.split('，')
    : [concept.heading, ''];

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
            {headingLine1}
            {headingLine2 && (
              <>
                ，<br />
                {headingLine2}
              </>
            )}
          </h2>
          {concept.paragraphs.map((p, i) => renderParagraph(p, i, i + 2))}
        </div>
        <div className="concept-img img-rv rv relative aspect-[3/4]">
          <Image
            className="object-cover"
            src={concept.image}
            alt="AILAV 概念意象"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
