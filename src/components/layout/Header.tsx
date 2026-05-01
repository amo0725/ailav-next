'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import type { Social } from '@/lib/content/types';
import { useScrollListener } from '@/hooks/useScrollListener';
import { gsap } from '@/lib/gsap';

// Lower-radius blur cuts GPU work ~50% vs 24px while still reading as
// frosted on retina displays. Animating backdrop-filter via CSS transition
// is a known jank source — we only swap it instantly between solid/non-solid.
const BLUR_FILTER = 'blur(12px) saturate(1.5)';

export default function Header({ social }: { social: Social }) {
  const [navOpen, setNavOpen] = useState(false);
  const [hdrClass, setHdrClass] = useState('hdr inv');
  const [isDark, setIsDark] = useState(false);
  const lastSyRef = useRef(0);

  const [isHighContrast, setIsHighContrast] = useState(false);

  // Watch for theme + contrast changes
  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.dataset.theme === 'dark');
      setIsHighContrast(document.documentElement.dataset.contrast === 'high');
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-contrast'] });
    return () => obs.disconnect();
  }, []);

  const toggleNav = useCallback((open?: boolean) => {
    setNavOpen((prev) => {
      const next = open ?? !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      document.documentElement.style.overflow = next ? 'hidden' : '';
      // Flag for CSS to hide the CustomCursor dot while the overlay is up.
      // The cursor's repaint above the nav-ov backdrop-filter was forcing
      // the underlying blur to re-evaluate every frame — freezing the
      // dot during nav-open eliminates the storm without sacrificing the
      // frosted-glass look.
      if (next) {
        document.body.dataset.navOpen = 'true';
        // GSAP keeps a 60 fps RAF heartbeat alive while any tween or
        // ScrollTrigger is registered (DevTools trace: _rafBugFix
        // 128 ms). Putting the ticker to sleep stops that heartbeat
        // entirely — it auto-resumes on `.wake()` below without losing
        // any registered triggers.
        gsap.ticker.sleep();
      } else {
        delete document.body.dataset.navOpen;
        gsap.ticker.wake();
      }
      return next;
    });
  }, []);

  const heroAreaRef2 = useRef<HTMLElement | null>(null);
  useEffect(() => { heroAreaRef2.current = document.querySelector('[id="hero"]'); }, []);

  useScrollListener((sy) => {
    const heroH = heroAreaRef2.current ? heroAreaRef2.current.offsetHeight * 0.12 : 0;
    const overHero = heroAreaRef2.current ? sy < heroH : false;

    const classes = ['hdr'];
    if (overHero) classes.push('inv');
    if (!overHero && sy > 50) classes.push('solid');
    if (sy > lastSyRef.current && sy > 300) classes.push('up');

    setHdrClass((prev) => {
      const next = classes.join(' ');
      return prev === next ? prev : next;
    });

    lastSyRef.current = sy;
  });

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && navOpen) {
        toggleNav(false);
      }
    }
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [navOpen, toggleNav]);

  const combinedClass = navOpen ? `${hdrClass} nav-open` : hdrClass;
  const isSolid = hdrClass.includes('solid');

  // Memoise to keep the same object reference across renders — prevents
  // React from rewriting style attrs on the fixed header on every scroll
  // tick, which was causing repaint storms on desktop. Animating
  // backdrop-filter via CSS transition is GPU-expensive (full-screen blur
  // recompute every frame for 400ms), so it's deliberately omitted from
  // the transition list — the blur snaps in/out instantly.
  // backdrop-filter on a 100vw × 100dvh fixed overlay scales linearly
  // with viewport area — confirmed empirically that hover lag worsens
  // on larger windows. Replaced with a higher-alpha solid background;
  // the visual is close to the frosted look at typical opacities and
  // costs nothing per frame regardless of viewport size.
  const navStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: isHighContrast
      ? (isDark ? 'rgba(0,0,0,.98)' : 'rgba(255,255,255,.98)')
      : (isDark ? 'rgba(11,11,10,.92)' : 'rgba(252,251,247,.92)'),
  }), [isHighContrast, isDark]);

  const headerStyle = useMemo<React.CSSProperties>(() => ({
    transition: 'background .4s, color .4s, transform .4s cubic-bezier(.16,1,.3,1)',
    transform: 'translate3d(0,0,0)',
    // `will-change` deliberately omitted — CSS Working Group guidance
    // is that permanent will-change occupies GPU memory and can hurt
    // perf overall. We only get the layer-promotion benefit via the
    // explicit translate3d above, which is enough for the header.
    ...(isSolid ? {
      backgroundColor: isHighContrast
        ? (isDark ? 'rgba(0,0,0,.95)' : 'rgba(255,255,255,.95)')
        : (isDark ? 'rgba(11,11,10,.7)' : 'rgba(255,255,255,.65)'),
      backgroundClip: 'padding-box',
      backdropFilter: isHighContrast ? 'none' : BLUR_FILTER,
      WebkitBackdropFilter: isHighContrast ? 'none' : BLUR_FILTER,
      border: 'none',
      borderBottom: '1.5px solid transparent',
      textShadow: 'none',
    } : {}),
  }), [isSolid, isHighContrast, isDark]);

  return (
    <>
      <header
        className={`${combinedClass} fixed top-0 left-0 right-0 z-[100] px-[var(--gutter)] h-20 md:h-[92px] flex items-center justify-between`}
        style={headerStyle}
        id="hdr"
      >
        <Link
          href="/"
          className="hdr-logo z-[101] flex items-center transition-[opacity,filter] duration-300"
          aria-label="AILAV -- 回到首頁"
        >
          <img
            className="h-[clamp(64px,8vw,80px)] w-auto"
            src="/images/logo.svg"
            alt="AILAV"
            width={80}
            height={80}
          />
        </Link>
        <div className="hdr-right flex items-center gap-6 z-[101]">
          <a
            href="#reserve"
            className="hdr-res hidden md:inline-block [font-family:var(--serif)] text-[.82rem] font-normal tracking-[.22em] uppercase px-7 py-[11px] border-[1.5px] border-[var(--fg)] transition-all duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)] hover:border-[var(--fg)]"
          >
            Reservation
          </a>
          <button
            className={`ham ${navOpen ? 'x' : ''} w-8 h-6 flex flex-col justify-center gap-[7px] z-[101]`}
            id="ham"
            aria-label="開啟選單"
            aria-expanded={navOpen}
            aria-controls="nav"
            onClick={() => toggleNav()}
          >
            <span className="block w-full h-px bg-[var(--fg)] transition-all duration-400 origin-center"></span>
            <span className="block w-full h-px bg-[var(--fg)] transition-all duration-400 origin-center"></span>
          </button>
        </div>
      </header>

      <nav
        className={`nav-ov ${navOpen ? 'open' : ''} fixed inset-0 z-[101] flex items-center justify-center opacity-0 invisible pointer-events-none transition-[opacity,visibility] duration-500 [&>*]:pointer-events-auto`}
        style={navStyle}
        id="nav"
        aria-label="主要選單"
        aria-hidden={!navOpen}
      >
        {/* Nav internal header: logo + close */}
        <div className="absolute top-0 left-0 right-0 h-20 md:h-[92px] px-[var(--gutter)] flex items-center justify-between z-[102]">
          <Link href="/" className="flex items-center" aria-label="AILAV" onClick={() => toggleNav(false)}>
            <img
              className="h-[clamp(64px,8vw,80px)] w-auto"
              src="/images/logo.svg"
              alt="AILAV"
              width={80}
              height={80}
              style={{ filter: isDark ? 'invert(1)' : 'none' }}
            />
          </Link>
          <button
            className="w-8 h-6 flex flex-col justify-center gap-[7px]"
            onClick={() => toggleNav(false)}
            aria-label="關閉選單"
          >
            <span className="block w-full h-px bg-[var(--fg)] origin-center" style={{ transform: 'rotate(45deg) translate(2.5px, 2.5px)' }}></span>
            <span className="block w-full h-px bg-[var(--fg)] origin-center" style={{ transform: 'rotate(-45deg) translate(2.5px, -2.5px)' }}></span>
          </button>
        </div>

        <ul className="nav-list list-none text-center">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="overflow-hidden">
              <a
                href={link.href}
                className="relative inline-block [font-family:var(--serif)] text-[clamp(2rem,5vw,3.6rem)] font-light tracking-[.08em] py-2.5 [transform:translateY(110%)] opacity-0 transition-[transform,opacity] duration-[.6s]"
                data-nav=""
                onClick={() => toggleNav(false)}
              >
                {link.zh}
                <span className="en block text-[.5em] tracking-[.3em] text-[var(--fg3)] mt-0.5">
                  {link.en}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-foot absolute bottom-10 flex gap-7 text-[.65rem] tracking-[.2em] uppercase text-[var(--fg3)]">
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
              Instagram
            </a>
          )}
          {social.facebook && (
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
              Facebook
            </a>
          )}
          <a href="#" className="hover:text-[var(--fg)]">EN / 中</a>
        </div>
      </nav>
    </>
  );
}
