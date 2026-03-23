'use client';

import { useState, useEffect } from 'react';

export default function SoundToggle() {
  const [visible, setVisible] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const ambientSect = document.getElementById('ambientSect');
    if (!ambientSect) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setVisible(e.isIntersecting));
      },
      { threshold: 0.1 },
    );
    obs.observe(ambientSect);
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const vid = document.querySelector('video') as HTMLVideoElement | null;
    const next = !on;
    setOn(next);
    if (vid) vid.muted = !next;
  };

  return (
    <button
      className={`snd fixed bottom-5 right-5 z-[90] w-10 h-10 rounded-full bg-white/45 backdrop-blur-[12px] saturate-[1.3] border-[1.5px] border-white/25 flex items-center justify-center opacity-0 [transform:translateY(8px)] transition-all duration-400 shadow-[0_2px_10px_rgba(0,0,0,.06)] hover:bg-[var(--fg)] hover:text-[var(--bg)]${visible ? ' on' : ''}`}
      onClick={toggle}
      aria-label={on ? '關閉環境音效' : '開啟環境音效'}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {on ? (
          <>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        ) : (
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        )}
      </svg>
    </button>
  );
}
