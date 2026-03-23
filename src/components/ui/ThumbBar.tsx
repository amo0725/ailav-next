'use client';

import { useState, useEffect, useRef } from 'react';
import { useScrollListener } from '@/hooks/useScrollListener';

export default function ThumbBar() {
  const [show, setShow] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => { heroRef.current = document.querySelector('[id="hero"]'); }, []);

  useScrollListener((sy) => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pastHero = heroRef.current ? sy > heroRef.current.offsetHeight * 0.5 : sy > 300;
    const nearFooter = h > 0 && sy > h - 200;
    const next = pastHero && !nearFooter;
    setShow((prev) => (prev === next ? prev : next));
  });

  return (
    <div
      className={`thumb-bar${show ? ' show' : ''} hidden md:hidden max-md:flex fixed bottom-[calc(16px+env(safe-area-inset-bottom))] left-1/2 z-[95] [transform:translateX(-50%)_translateY(calc(100%+40px))] gap-1.5 p-1.5 rounded-[50px] bg-white/50 backdrop-blur-[16px] saturate-[1.4] border-[1.5px] border-transparent shadow-[0_8px_32px_rgba(0,0,0,.1),0_2px_8px_rgba(0,0,0,.06)] transition-[transform,opacity] duration-500`}
      style={{ backgroundClip: 'padding-box' }}
      id="thumbBar"
    >
      <a href="#menu" className="thumb-btn sec text-center [font-family:var(--serif)] text-[.72rem] tracking-[.18em] uppercase px-7 py-3 rounded-[44px] transition-all duration-300 whitespace-nowrap text-[var(--fg)] active:bg-[rgba(0,0,0,.05)]">
        Menu
      </a>
      <a href="#reserve" className="thumb-btn pri text-center [font-family:var(--serif)] text-[.72rem] tracking-[.18em] uppercase px-7 py-3 rounded-[44px] transition-all duration-300 whitespace-nowrap bg-[var(--fg)] text-[var(--bg)] active:scale-[.96]">
        Reservation
      </a>
    </div>
  );
}
