'use client';

import { useEffect, useRef } from 'react';

type ScrollCallback = (scrollY: number) => void;

const listeners = new Set<ScrollCallback>();
let ticking = false;
let initialized = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      listeners.forEach((fn) => fn(sy));
      ticking = false;
    });
    ticking = true;
  }
}

/**
 * Single shared scroll listener with rAF throttle.
 * All consumers share one scroll event + one rAF per frame.
 */
export function useScrollListener(callback: ScrollCallback) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    const handler: ScrollCallback = (sy) => cbRef.current(sy);
    listeners.add(handler);

    if (!initialized) {
      window.addEventListener('scroll', onScroll, { passive: true });
      initialized = true;
    }

    return () => {
      listeners.delete(handler);
      if (listeners.size === 0) {
        window.removeEventListener('scroll', onScroll);
        initialized = false;
      }
    };
  }, []);
}
