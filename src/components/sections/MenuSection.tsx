import type { MenuItem } from '@/lib/content/types';

export default function MenuSection({ items }: { items: MenuItem[] }) {
  return (
    <section
      className="relative z-[6] bg-[var(--bg2)] px-[var(--gutter)] py-[clamp(80px,12vw,180px)]"
      id="menu"
    >
      <div className="mx-auto max-w-[var(--max)]">
        <div className="text-center mb-12">
          <span className="rv block text-[clamp(.7rem,.9vw,.8rem)] tracking-[.35em] uppercase text-[var(--fg3)] mb-5">
            Menu
          </span>
          <h2 className="rv rv-d1 [font-family:var(--serif)] text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.3]">
            當季套餐
          </h2>
          <p className="rv rv-d2 text-[var(--fg2)] max-w-[560px] mx-auto leading-[1.9] text-[clamp(.88rem,1.1vw,1.02rem)]">
            週末主食饗宴、平日品味套餐與深夜 Wine Bar——兩種節奏，三個場景。
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7">
          {items.map((item, index) => (
            <div key={item.id} className={`mcard rv rv-d${index + 1}`}>
              <h3>{item.title}</h3>
              <p className="price">{item.price}</p>
              <p>{item.description}</p>
              {item.note && (
                <p className="note mt-3 text-[.78rem] leading-[1.8] text-[var(--fg3)] [font-family:var(--serif)] tracking-[.04em] whitespace-pre-line">
                  {item.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
