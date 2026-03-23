'use client';

import { useEffect } from 'react';

/**
 * Global IntersectionObserver that adds .vis to all .rv elements.
 * This replicates the original inline JS scroll-reveal behavior.
 * Must be mounted once at page level.
 */
export default function ScrollRevealInit() {
  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('.rv');

    if (noMotion) {
      elements.forEach((el) => el.classList.add('vis'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
