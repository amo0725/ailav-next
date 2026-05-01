'use client';

import { useEffect } from 'react';

/**
 * Prompt the user before unloading the page when `when` is true.
 *
 * Used by admin editors to guard unsaved edits across hard navigations
 * (tab close, reload, address-bar nav). Soft router navigations are
 * preserved through Activity-mode caching, so dirty state survives them
 * automatically — this hook only handles the unload boundary.
 */
export function useBeforeUnload(when: boolean): void {
  useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [when]);
}
