'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { NAV_LINKS, SOCIAL } from '@/lib/constants';
import { useScrollListener } from '@/hooks/useScrollListener';

export default function Header() {
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
      if (next) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
      } else {
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
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

  // Inline style for solid state to bypass PostCSS mangling backdrop-filter
  const headerStyle: React.CSSProperties = {
    transition: 'background .4s, color .4s, backdrop-filter .4s, -webkit-backdrop-filter .4s, transform .4s cubic-bezier(.16,1,.3,1)',
    ...(isSolid ? {
      backgroundColor: isHighContrast
        ? (isDark ? 'rgba(0,0,0,.95)' : 'rgba(255,255,255,.95)')
        : (isDark ? 'rgba(11,11,10,.7)' : 'rgba(255,255,255,.65)'),
      backgroundClip: 'padding-box',
      backdropFilter: isHighContrast ? 'none' : 'blur(24px) saturate(1.5)',
      WebkitBackdropFilter: isHighContrast ? 'none' : 'blur(24px) saturate(1.5)',
      border: 'none',
      borderBottom: '1.5px solid transparent',
      textShadow: 'none',
    } : {}),
  };

  return (
    <>
      <header
        className={`${combinedClass} fixed top-0 left-0 right-0 z-[100] px-[var(--gutter)] h-20 md:h-[92px] flex items-center justify-between`}
        style={headerStyle}
        id="hdr"
      >
        <a
          href="#"
          className="hdr-logo z-[101] flex items-center transition-[opacity,filter] duration-300"
          aria-label="AILAV -- 回到首頁"
        >
          <img
            className="h-[clamp(64px,8vw,80px)] w-auto"
            src="/images/logo.svg"
            alt="AILAV"
          />
        </a>
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
        className={`nav-ov ${navOpen ? 'open' : ''} fixed inset-0 z-[101] flex items-center justify-center opacity-0 invisible transition-[opacity,visibility] duration-500`}
        style={{
          backgroundColor: isHighContrast
            ? (isDark ? 'rgba(0,0,0,.95)' : 'rgba(255,255,255,.95)')
            : (isDark ? 'rgba(11,11,10,.7)' : 'rgba(255,255,255,.65)'),
          backdropFilter: isHighContrast ? 'none' : 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: isHighContrast ? 'none' : 'blur(24px) saturate(1.5)',
        }}
        id="nav"
        aria-label="主要選單"
        aria-hidden={!navOpen}
      >
        {/* Nav internal header: logo + close */}
        <div className="absolute top-0 left-0 right-0 h-20 md:h-[92px] px-[var(--gutter)] flex items-center justify-between z-[102]">
          <a href="#" className="flex items-center" aria-label="AILAV" onClick={() => toggleNav(false)}>
            <img
              className="h-[clamp(64px,8vw,80px)] w-auto"
              src="/images/logo.svg"
              alt="AILAV"
              style={{ filter: isDark ? 'invert(1)' : 'none' }}
            />
          </a>
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
                className="relative inline-block [font-family:var(--serif)] text-[clamp(2rem,5vw,3.6rem)] font-light tracking-[.08em] py-2.5 [transform:translateY(110%)] opacity-0 transition-[transform,opacity,letter-spacing] duration-[.6s]"
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
          <a href={SOCIAL.instagram} target="_blank" rel="noopener" className="hover:text-[var(--fg)]">
            Instagram
          </a>
          <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
            Facebook
          </a>
          <a href="#" className="hover:text-[var(--fg)]">EN / 中</a>
        </div>
      </nav>
    </>
  );
}
