'use client';

import { useState, useEffect, useCallback } from 'react';
import { useVisitCount } from '@/hooks/useVisitCount';
import { WELCOME_SHOW_DELAY_MS, WELCOME_HIDE_DELAY_MS } from '@/lib/constants';

export default function WelcomeBanner() {
  const [show, setShow] = useState(false);
  const { isFirstVisit } = useVisitCount();

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), WELCOME_SHOW_DELAY_MS);
    const hideTimer = setTimeout(() => setShow(false), WELCOME_HIDE_DELAY_MS);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  const close = useCallback(() => setShow(false), []);

  const title = isFirstVisit ? '歡迎蒞臨' : '歡迎回來';
  const text = isFirstVisit
    ? '探索 AILAV 的料理哲學與亞洲風土。'
    : '當季菜單已更新，期待您的到來。';
  const ctaLabel = isFirstVisit ? '認識我們' : '立即預約';
  const ctaHref = isFirstVisit ? '#concept' : '#reserve';

  return (
    <div
      className={`wb${show ? ' show' : ''} fixed top-[100px] right-[var(--gutter)] max-md:right-4 max-md:left-4 max-md:max-w-none z-[95] bg-white/50 backdrop-blur-[14px] saturate-[1.3] border-[1.5px] border-transparent rounded-[10px] px-6 py-5 max-w-[300px] opacity-0 [transform:translateX(16px)] transition-all duration-[.6s] pointer-events-none`}
      style={{ backgroundClip: 'padding-box' }}
      id="wb"
    >
      <button
        className="absolute top-2.5 right-2.5 text-[var(--fg3)] hover:text-[var(--fg)] text-[.9rem] leading-none transition-colors"
        id="wbX"
        onClick={close}
        aria-label="關閉"
      >
        &times;
      </button>
      <h4 className="[font-family:var(--serif)] text-[clamp(1rem,1.4vw,1.15rem)] font-light tracking-wider" id="wbT">
        {title}
      </h4>
      <p className="text-[clamp(.78rem,.95vw,.85rem)] text-[var(--fg2)] leading-relaxed mt-1.5" id="wbP">
        {text}
      </p>
      <div className="flex gap-2.5 mt-2.5">
        <a
          href={ctaHref}
          className="inline-block [font-family:var(--serif)] text-[.68rem] tracking-[.18em] uppercase px-3.5 py-[7px] bg-[var(--fg)] text-[var(--bg)] border border-[var(--fg)] transition-all duration-300"
          id="wbCta"
          onClick={close}
        >
          {ctaLabel}
        </a>
        <a
          href="#menu"
          className="inline-block [font-family:var(--serif)] text-[.68rem] tracking-[.18em] uppercase px-3.5 py-[7px] border border-[rgba(0,0,0,.1)] text-[var(--fg2)] transition-all duration-300 hover:border-[var(--fg)] hover:text-[var(--fg)]"
          onClick={close}
        >
          菜單
        </a>
      </div>
    </div>
  );
}
