import type { Chef } from '@/lib/content/types';
import ChefImageHover from './ChefImageHover';

export default function ChefSection({ chefs }: { chefs: Chef[] }) {
  return (
    <section
      className="relative z-[6] bg-[var(--bg)] px-[var(--gutter)] py-[clamp(80px,12vw,180px)]"
      id="chef"
    >
      <div className="mx-auto max-w-[var(--max)]">
        <div className="text-center mb-[clamp(60px,8vw,100px)]">
          <span className="rv block text-[clamp(.7rem,.9vw,.8rem)] tracking-[.35em] uppercase text-[var(--fg3)] mb-5">
            Chefs
          </span>
          <h2 className="rv rv-d1 [font-family:var(--serif)] text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.3]">
            料理的追尋者
          </h2>
        </div>

        {chefs.map((chef, index) => (
          <div key={chef.id}>
            {index > 0 && (
              <div className="w-10 h-px bg-[var(--accent)] mx-auto my-[clamp(60px,8vw,100px)] opacity-30"></div>
            )}
            <div
              className={`grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-12 lg:gap-[clamp(48px,7vw,110px)] items-center${
                chef.flip ? ' lg:direction-rtl' : ''
              }`}
              style={chef.flip ? { direction: 'rtl' } : undefined}
              data-dof=""
            >
              <div
                className="chef-img img-rv rv dof-focus relative aspect-[16/10] lg:aspect-[4/5] overflow-hidden"
                style={chef.flip ? { direction: 'ltr' } : undefined}
              >
                <ChefImageHover
                  images={chef.images}
                  alt={`主廚 ${chef.name.split(' — ')[0]}`}
                />
              </div>
              <div className="dof-blur" style={chef.flip ? { direction: 'ltr' } : undefined}>
                <p className="rv [font-family:var(--serif)] text-base text-[var(--accent)] tracking-[.15em] mb-6">
                  {chef.name}
                </p>
                {chef.bio.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`rv rv-d${i + 1} text-[var(--fg2)] text-[clamp(.9rem,1.1vw,1.05rem)] leading-[2]${
                      i > 0 ? ' mt-3' : ''
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
                {chef.awards.length > 0 && (
                  <div
                    className={`awards rv rv-d${chef.bio.length + 1} mt-6 pt-[18px] border-t border-[rgba(0,0,0,.06)] flex flex-wrap gap-7`}
                  >
                    {chef.awards.map((award, i) => (
                      <div key={i} className="award">
                        <strong>{award.stat}</strong>
                        {award.label.split('\n').map((line, j) => (
                          <span key={j}>
                            {j > 0 && <br />}
                            {line}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
