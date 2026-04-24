'use client';

import { useEffect } from 'react';

/* Auto-fires the browser print dialog once images have settled.
 * Skipped if the user is on a touch device or already initiated print
 * (avoids re-triggering on hot-reload during development).
 */
export default function PrintTrigger() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    let cancelled = false;
    const wait = () => {
      if (cancelled) return;
      const images = Array.from(document.images);
      const allLoaded = images.every((img) => img.complete);
      if (allLoaded) {
        window.print();
      } else {
        setTimeout(wait, 200);
      }
    };
    const t = setTimeout(wait, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return null;
}
