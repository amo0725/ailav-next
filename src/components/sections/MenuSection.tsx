import { MENU_ITEMS } from '@/lib/constants';

export default function MenuSection() {
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
          <p className="rv rv-d2 text-[var(--fg2)] max-w-[520px] mx-auto leading-[1.9] text-[clamp(.88rem,1.1vw,1.02rem)]">
            菜單隨季節流轉，每次造訪都是全新的味覺旅程。
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7">
          {MENU_ITEMS.map((item, index) => (
            <div key={item.id} className={`mcard rv rv-d${index + 1}`}>
              <h3>{item.title}</h3>
              <p className="price">{item.price}</p>
              <p>
                {item.description}
                {item.note && (
                  <>
                    <br />
                    {item.note}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
