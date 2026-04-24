'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Status = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
type Phase = 'idle' | 'saving' | 'saved' | 'error';
type SaveFn<T> = (next: T) => Promise<{ ok: true } | { error: string }>;

export function useEditorForm<T>(initial: T, save: SaveFn<T>) {
  const [value, setValue] = useState<T>(initial);
  // `baseline` is the last-saved value; comparing `value` against it gives us
  // a derived `isDirty` flag without the setState-in-useEffect anti-pattern
  // (which React Compiler 1.0 flags and which can cascade re-renders).
  const [baseline, setBaseline] = useState<T>(initial);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | undefined>();
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty = useMemo(
    () => JSON.stringify(value) !== JSON.stringify(baseline),
    [value, baseline]
  );

  const status: Status =
    phase === 'saving' || phase === 'saved' || phase === 'error'
      ? phase
      : isDirty
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
      setBaseline(value);
      setPhase('saved');
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setPhase('idle'), 2400);
    },
    [value, save]
  );

  const update = useCallback((updater: (prev: T) => T) => {
    setValue((prev) => updater(prev));
    setPhase((prev) => (prev === 'saved' ? 'idle' : prev));
  }, []);

  const set = useCallback((next: T) => {
    setValue(next);
    setPhase((prev) => (prev === 'saved' ? 'idle' : prev));
  }, []);

  return { value, update, set, status, error, onSubmit };
}
