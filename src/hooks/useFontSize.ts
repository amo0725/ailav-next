'use client';

import { useState, useEffect, useCallback } from 'react';

type FontSize = 'normal' | 'large' | 'xlarge';

interface UseFontSizeReturn {
  fontSize: FontSize;
  cycleFontSize: () => void;
}

const SIZES: FontSize[] = ['normal', 'large', 'xlarge'];
const STORAGE_KEY = 'ailav-fs';

export function useFontSize(): UseFontSizeReturn {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as FontSize | null;
    const idx = saved ? SIZES.indexOf(saved) : 0;
    if (idx >= 0) setIndex(idx);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.fontsize = SIZES[index];
    localStorage.setItem(STORAGE_KEY, SIZES[index]);
  }, [index]);

  const cycleFontSize = useCallback(() => {
    setIndex((prev) => (prev + 1) % SIZES.length);
  }, []);

  return { fontSize: SIZES[index], cycleFontSize };
}
