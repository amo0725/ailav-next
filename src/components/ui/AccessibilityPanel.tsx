'use client';

import { useTheme } from '@/hooks/useTheme';
import { useFontSize } from '@/hooks/useFontSize';
import { useContrast } from '@/hooks/useContrast';

const A11Y_BTN = 'a11y-b w-10 h-10 rounded-full bg-white/45 backdrop-blur-[12px] saturate-[1.3] border-[1.5px] border-white/25 flex items-center justify-center text-[.7rem] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,.06)] hover:bg-[var(--fg)] hover:text-[var(--bg)]';

export default function AccessibilityPanel() {
  const { isDark, toggleTheme } = useTheme();
  const { cycleFontSize } = useFontSize();
  const { toggleContrast } = useContrast();

  return (
    <div className="fixed bottom-5 max-md:bottom-20 left-5 z-[90] flex flex-col gap-2">
      <button className={A11Y_BTN} onClick={toggleTheme} aria-label="切換深色模式">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {isDark ? (
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </>
          )}
        </svg>
      </button>
      <button className={A11Y_BTN} onClick={cycleFontSize} aria-label="放大字體">
        <span className="[font-family:var(--serif)]">A</span>
      </button>
      <button className={A11Y_BTN} onClick={toggleContrast} aria-label="高對比度">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
