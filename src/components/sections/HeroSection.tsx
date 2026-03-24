'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { HERO_MAIN_IMAGE, HERO_SCATTER_IMAGES } from '@/lib/constants';

export default function HeroSection() {
  const heroAreaRef = useRef<HTMLElement>(null);
  const heroPinRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const heroOvRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const heroPhiloRef = useRef<HTMLDivElement>(null);

  /* ── Hero title reveal after loader (3200ms) ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      const t = document.querySelector('.hero-t') as HTMLElement | null;
      const s = document.querySelector('.hero-st') as HTMLElement | null;
      if (t) {
        gsap.to(t, { opacity: 1, y: 0, duration: 1.2, delay: 0.15, ease: 'expo.out' });
      }
      if (s) {
        gsap.to(s, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'expo.out' });
      }
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  /* ── GSAP ScrollTrigger for hero shrink ── */
  useEffect(() => {
    const heroArea = heroAreaRef.current;
    const heroPin = heroPinRef.current;
    const heroImg = heroImgRef.current;
    const heroOv = heroOvRef.current;
    const heroScroll = heroScrollRef.current;
    const heroPhilo = heroPhiloRef.current;

    if (!heroArea || !heroPin || !heroImg) return;

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noMotion) return;

    // Cache queries outside scroll handler
    const giEls = heroPin.querySelectorAll('[data-gi]');
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let resizeRafId = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        vw = window.innerWidth;
        vh = window.innerHeight;
      });
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Track previous states to skip no-op DOM writes
    let prevAbs = false;
    let prevHide = false;
    let prevGiIn = false;
    let prevPhilo = false;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroArea,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;

          const shouldAbs = p >= 0.99;
          if (shouldAbs !== prevAbs) { heroPin.classList.toggle('abs', shouldAbs); prevAbs = shouldAbs; }

          const rawShrink = Math.max(0, Math.min(1, (p - 0.1) / 0.55));
          const ease = 1 - Math.pow(1 - rawShrink, 3);

          const isMobile = vw < 769;
          const tL = isMobile ? vw * 0.06 : vw * 0.22;
          const tT = isMobile ? vh * 0.04 : vh * 0.06;
          const tR = isMobile ? vw * 0.06 : vw * 0.22;
          const tB = isMobile ? vh * 0.12 : vh * 0.30;

          heroImg.style.inset = `${tT * ease}px ${tR * ease}px ${tB * ease}px ${tL * ease}px`;
          heroImg.style.borderRadius = `${6 * ease}px`;
          heroImg.style.setProperty('--grad', String(1 - ease));

          if (heroOv) {
            heroOv.style.opacity = String(Math.max(0, 1 - p * 4.5));
            heroOv.style.transform = `translateY(${-p * 70}px)`;
          }

          const shouldHide = p > 0.015;
          if (shouldHide !== prevHide && heroScroll) { heroScroll.classList.toggle('hide', shouldHide); prevHide = shouldHide; }

          const shouldGiIn = ease > 0.45;
          if (shouldGiIn !== prevGiIn) { giEls.forEach((el) => el.classList.toggle('in', shouldGiIn)); prevGiIn = shouldGiIn; }

          const shouldPhilo = ease > 0.75;
          if (shouldPhilo !== prevPhilo && heroPhilo) { heroPhilo.classList.toggle('show', shouldPhilo); prevPhilo = shouldPhilo; }
        },
      });
    }, heroArea);

    return () => { ctx.revert(); cancelAnimationFrame(resizeRafId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <section className="relative h-[280vh] max-md:h-[180vh]" id="hero" ref={heroAreaRef}>
      <div
        className="hero-pin fixed top-0 left-0 w-full h-dvh z-[5] flex items-center justify-center bg-[var(--bg)] overflow-hidden pointer-events-none"
        id="heroPin"
        ref={heroPinRef}
      >
        <div
          className="hero-img-wrap absolute inset-0 overflow-hidden will-change-[inset,border-radius]"
          id="heroImg"
          ref={heroImgRef}
        >
          <Image
            className="object-cover brightness-[.84] saturate-[.78]"
            src={HERO_MAIN_IMAGE}
            alt="AILAV 精緻料理擺盤 高雄餐廳"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center text-white pointer-events-none"
          id="heroOv"
          ref={heroOvRef}
        >
          <h1 className="hero-t [font-family:var(--serif)] text-[clamp(3rem,8.5vw,7.5rem)] font-light tracking-[.22em] leading-none opacity-0 [transform:translateY(30px)]"
            style={{ textShadow: '0 2px 30px rgba(0,0,0,.4), 0 0px 80px rgba(0,0,0,.2)' }}
          >
            AILAV
          </h1>
          <p className="hero-st [font-family:var(--serif)] text-[clamp(.75rem,1.3vw,.9rem)] tracking-[.5em] uppercase mt-[18px] opacity-0 [transform:translateY(15px)] text-white/75"
            style={{ textShadow: '0 1px 20px rgba(0,0,0,.5)' }}
          >
            A Migratory Chef&apos;s Journey of Flavor &amp; Love
          </p>
        </div>
        <div
          className="hero-scroll absolute bottom-7 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-1.5 text-white/40 text-[.55rem] tracking-[.3em] uppercase transition-opacity duration-400"
          id="heroScroll"
          ref={heroScrollRef}
          aria-hidden="true"
        >
          <span>Scroll</span>
          <div className="line w-px h-10 bg-gradient-to-b from-white/50 to-transparent animate-pulse"></div>
        </div>

        {HERO_SCATTER_IMAGES.map((img) => (
          <div
            key={img.className}
            className={`hero-gi ${img.className} absolute overflow-hidden z-[1] pointer-events-none shadow-[0_8px_30px_rgba(0,0,0,.08)] hidden md:block`}
            data-gi=""
          >
            <Image
              className="object-cover saturate-[.68] brightness-[.95] [transform:scale(1.15)] transition-transform duration-[1.4s]"
              src={img.src}
              alt={img.alt}
              fill
              sizes="20vw"
            />
          </div>
        ))}

        <div
          className="hero-philo absolute bottom-[20vh] left-1/2 z-[3] text-center w-auto max-w-[520px] pointer-events-none bg-transparent p-0 opacity-0 [transform:translateX(-50%)_translateY(18px)] transition-[opacity,transform] duration-[.9s] hidden md:block"
          id="heroPhilo"
          ref={heroPhiloRef}
        >
          <span className="philo-line block w-7 h-px bg-[var(--accent)] mx-auto mb-3.5 opacity-50"></span>
          <p className="[font-family:var(--serif)] text-[clamp(.88rem,1.5vw,1.05rem)] font-light italic text-[var(--fg)] leading-[1.9] tracking-[.04em] m-0">
            Pronounced as &quot;I Love&quot; &mdash;<br />一位遷徙主廚的風味與愛的旅程。
          </p>
        </div>
      </div>
    </section>
  );
}
