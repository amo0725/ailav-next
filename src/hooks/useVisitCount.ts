'use client';

import { useState, useEffect } from 'react';

interface UseVisitCountReturn {
  visitCount: number;
  isFirstVisit: boolean;
  isReturning: boolean;
}

const STORAGE_KEY = 'ailav-v';

export function useVisitCount(): UseVisitCountReturn {
  const [visitCount, setVisitCount] = useState(1);

  useEffect(() => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) + 1;
    localStorage.setItem(STORAGE_KEY, String(count));
    setVisitCount(count);
  }, []);

  return {
    visitCount,
    isFirstVisit: visitCount === 1,
    isReturning: visitCount > 1,
  };
}
