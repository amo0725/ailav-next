'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
type Phase = 'idle' | 'saving' | 'saved' | 'error';
type SaveFn<T> = (next: T) => Promise<{ ok: true } | { error: string }>;

/**
 * Editor form state hook used by every admin editor.
 *
 * Tracks dirtiness with a boolean flag flipped by `update`/`set`, instead of
 * `JSON.stringify(value) !== JSON.stringify(baseline)` on every render.
 * Stringifying nested CMS trees on every keystroke was wasteful; the flag
 * approach is O(1) and avoids both the React Compiler `set-state-in-effect`
 * cascade trap and the deep-comparison overhead.
 *
 * Trade-off: editing a value and then manually undoing back to the original
 * leaves `dirty=true` until save. For a CMS that's fine — saving the same
 * data is a no-op write that produces an identical blob payload.
 */
export function useEditorForm<T>(initial: T, save: SaveFn<T>) {
  const [value, setValue] = useState<T>(initial);
  const [phase, setPhase] = useState<Phase>('idle');
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status: Status =
    phase === 'saving' || phase === 'saved' || phase === 'error'
      ? phase
      : dirty
      ? 'dirty'
      : 'idle';

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const onSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      setPhase('saving');
      setError(undefined);
      const res = await save(value);
      if ('error' in res) {
        setPhase('error');
        setError(res.error);
        return;
      }
      setDirty(false);
      setPhase('saved');
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setPhase('idle'), 2400);
    },
    [value, save]
  );

  const update = useCallback((updater: (prev: T) => T) => {
    setValue((prev) => updater(prev));
    setDirty(true);
    // Edits cancel a transient "saved" badge so the UI doesn't lie about
    // the current state being saved.
    setPhase((prev) => (prev === 'saved' ? 'idle' : prev));
  }, []);

  const set = useCallback((next: T) => {
    setValue(next);
    setDirty(true);
    setPhase((prev) => (prev === 'saved' ? 'idle' : prev));
  }, []);

  return { value, update, set, status, error, onSubmit };
}
