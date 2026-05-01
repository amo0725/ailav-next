'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      if (dot) dot.style.display = 'none';
      return;
    }

    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let rafId = 0;
    let running = false;

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      dot.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;

      // Stop loop when cursor has converged (within 0.5px)
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        rafId = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const startLoop = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      startLoop();
    };

    const hoverSelectors = 'a,button,.hero-gi,.mcard,.cta,.award,.info-detail,.foot-social a,.a11y-b,.snd,.chef-img,.concept-img';

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(hoverSelectors)) dot.classList.add('big');
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(hoverSelectors)) dot.classList.remove('big');
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    // Flag for CSS to hide the native OS cursor only on pages where the
    // custom dot is actually rendered (i.e. not /admin). Removed on
    // unmount so the OS cursor returns automatically.
    document.body.dataset.cursorCustom = 'true';

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId);
      delete document.body.dataset.cursorCustom;
    };
  }, []);

  return <div ref={dotRef} className="cur" aria-hidden="true" />;
}
