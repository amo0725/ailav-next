'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseContrastReturn {
  isHighContrast: boolean;
  toggleContrast: () => void;
}

const STORAGE_KEY = 'ailav-hc';

export function useContrast(): UseContrastReturn {
  const [high, setHigh] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount (not available during SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHigh(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  useEffect(() => {
    document.documentElement.dataset.contrast = high ? 'high' : 'normal';
    localStorage.setItem(STORAGE_KEY, high ? '1' : '0');
  }, [high]);

  const toggleContrast = useCallback(() => setHigh((prev) => !prev), []);

  return { isHighContrast: high, toggleContrast };
}
