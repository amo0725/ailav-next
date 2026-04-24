'use client';

import { useEffect, useRef, useState } from 'react';
import FocalImage from '@/components/common/FocalImage';
import type { ImageInput } from '@/lib/content/image';
import { srcOf } from '@/lib/content/image';

type Props = {
  images: ImageInput[];
  alt: string;
};

export default function ChefImageHover({ images, alt }: Props) {
  const [idx, setIdx] = useState(0);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (images.length <= 1 || reducedMotionRef.current) return;
    if (!hovering) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 1800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovering, images.length]);

  const handleLeave = () => {
    setHovering(false);
    setIdx(0);
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      onFocus={() => setHovering(true)}
      onBlur={handleLeave}
    >
      {images.map((image, i) => (
        <FocalImage
          key={srcOf(image) + i}
          className={`saturate-[.75] transition-opacity duration-[900ms] ease-out ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
          asset={image}
          fallbackAlt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          priority={i === 0}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex gap-1.5 z-[2]" aria-hidden="true">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i === idx ? 'bg-white/90 w-4' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
