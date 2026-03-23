'use client';

import { useRef } from 'react';
import { useScrollListener } from '@/hooks/useScrollListener';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useScrollListener(() => {
    const bar = barRef.current;
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : '0%';
    }
  });

  return (
    <div
      className="scroll-progress fixed top-0 left-0 h-0.5 bg-[var(--accent)] z-[200] w-0 opacity-60"
      aria-hidden="true"
      ref={barRef}
    />
  );
}
