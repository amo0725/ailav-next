'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Global micro-interactions & effects initializer.
 * Handles: Liquid Distortion, Depth-of-Field, Shimmer CTA,
 * image parallax, card tilt, magnetic hover.
 * All GSAP-powered for 60fps performance.
 */
export default function GlobalEffects() {
  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noMotion) return;

    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const ctx = gsap.context(() => {
      /* ── Image parallax float on scroll ── */
      gsap.utils.toArray<HTMLElement>('.concept-img img, .chef-img img').forEach((img) => {
        gsap.to(img, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.concept-img, .chef-img') || img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      /* ── Depth-of-Field: blur text when chef image is centered ── */
      if (isDesktop) {
        document.querySelectorAll('[data-dof]').forEach((row) => {
          const focusEl = row.querySelector('.dof-focus');
          const blurEl = row.querySelector('.dof-blur');
          if (!focusEl || !blurEl) return;

          ScrollTrigger.create({
            trigger: focusEl,
            start: 'center 52%',
            end: 'center 48%',
            onEnter: () => row.classList.add('dof-active'),
            onLeave: () => row.classList.remove('dof-active'),
            onEnterBack: () => row.classList.add('dof-active'),
            onLeaveBack: () => row.classList.remove('dof-active'),
          });
        });
      }

      /* ── Shimmer CTA: glow when menu section is 80% visible ── */
      const ctaReserve = document.getElementById('ctaReserve');
      const menuSect = document.getElementById('menu');
      if (ctaReserve && menuSect) {
        ScrollTrigger.create({
          trigger: menuSect,
          start: 'top 20%',
          end: 'bottom top',
          onEnter: () => ctaReserve.classList.add('glow'),
          onLeave: () => ctaReserve.classList.remove('glow'),
          onEnterBack: () => ctaReserve.classList.add('glow'),
          onLeaveBack: () => ctaReserve.classList.remove('glow'),
        });
      }

      /* ── Fast-scroll desaturate: cheap saturate-only swap ──
         (`url(#liquidDistort)` SVG filter was removed — SVG filters run on
          CPU and stalled the cursor during heavy scrolls.) */
      if (isDesktop) {
        const liqImgs = document.querySelectorAll<HTMLImageElement>('.concept-img img, .chef-img img');
        let prevActive = false;
        ScrollTrigger.create({
          onUpdate: (self) => {
            const active = Math.abs(self.getVelocity()) > 800;
            if (active === prevActive) return;
            prevActive = active;
            liqImgs.forEach((img) => {
              img.style.filter = active ? 'saturate(.78)' : '';
            });
          },
        });
      }
    });

    /* ── Card tilt + Magnetic hover ──
       The previous implementation called getBoundingClientRect() inside
       every mousemove handler, forcing synchronous layout 60–1000×/sec
       on gaming mice. Combined with style writes this saturated the main
       thread and made the custom cursor feel laggy over interactive
       regions. The new pattern:

         1. Cache rect on `mouseenter`; refresh on resize/scroll.
         2. mousemove only stores latest pointer coords (no DOM read).
         3. A single rAF flush per frame writes the transform.
       Result: ≤1 layout-free style write per element per frame, no matter
       how often mousemove fires. */
    const cleanups: (() => void)[] = [];

    type HoverFormatter = (dx: number, dy: number, w: number, h: number) => string;

    const attachHover = (el: HTMLElement, format: HoverFormatter) => {
      let rect = el.getBoundingClientRect();
      let pendingX = 0;
      let pendingY = 0;
      let scheduled = false;
      let inside = false;

      const flush = () => {
        scheduled = false;
        if (!inside) return;
        const dx = pendingX - rect.left;
        const dy = pendingY - rect.top;
        el.style.transform = format(dx, dy, rect.width, rect.height);
      };

      const onEnter = () => {
        rect = el.getBoundingClientRect();
        inside = true;
      };
      const onMove = (e: MouseEvent) => {
        pendingX = e.clientX;
        pendingY = e.clientY;
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(flush);
        }
      };
      const onLeave = () => {
        inside = false;
        el.style.transform = '';
      };
      const refreshRect = () => { if (inside) rect = el.getBoundingClientRect(); };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      window.addEventListener('resize', refreshRect, { passive: true });
      window.addEventListener('scroll', refreshRect, { passive: true });

      cleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('resize', refreshRect);
        window.removeEventListener('scroll', refreshRect);
      });
    };

    if (isDesktop) {
      document.querySelectorAll<HTMLElement>('.mcard').forEach((card) => {
        attachHover(card, (dx, dy, w, h) => {
          const x = dx / w - 0.5;
          const y = dy / h - 0.5;
          return `translateY(-4px) perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        });
      });

      document.querySelectorAll<HTMLElement>('.cta, .hdr-res, .a11y-b, .snd, .foot-social a').forEach((el) => {
        attachHover(el, (dx, dy, w, h) => {
          const x = (dx - w / 2) * 0.25;
          const y = (dy - h / 2) * 0.25;
          return `translate(${x}px, ${y}px)`;
        });
      });
    }

    return () => { ctx.revert(); cleanups.forEach((fn) => fn()); };
  }, []);

  return null;
}
