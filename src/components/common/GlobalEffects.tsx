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

      /* ── Liquid Distortion: apply SVG filter on fast scroll ── */
      if (isDesktop) {
        const liqImgs = document.querySelectorAll<HTMLImageElement>('.concept-img img, .chef-img img');

        ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            const active = velocity > 800;
            liqImgs.forEach((img) => {
              img.style.filter = active ? 'url(#liquidDistort) saturate(.78)' : '';
            });
          },
        });
      }
    });

    /* ── Card tilt + Magnetic hover (non-GSAP, with cleanup) ── */
    const cleanups: (() => void)[] = [];

    if (isDesktop) {
      document.querySelectorAll<HTMLElement>('.mcard').forEach((card) => {
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `translateY(-4px) perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        };
        const onLeave = () => { card.style.transform = ''; };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); });
      });

      document.querySelectorAll<HTMLElement>('.cta, .hdr-res, .a11y-b, .snd, .foot-social a').forEach((el) => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.25;
          const y = (e.clientY - r.top - r.height / 2) * 0.25;
          el.style.transform = `translate(${x}px, ${y}px)`;
        };
        const onLeave = () => { el.style.transform = ''; };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanups.push(() => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); });
      });
    }

    return () => { ctx.revert(); cleanups.forEach((fn) => fn()); };
  }, []);

  return null;
}
