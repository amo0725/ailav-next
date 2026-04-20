'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
type SaveFn<T> = (next: T) => Promise<{ ok: true } | { error: string }>;

export function useEditorForm<T>(initial: T, save: SaveFn<T>) {
  const [value, setValue] = useState<T>(initial);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | undefined>();
  const initialRef = useRef(initial);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const isDirty = JSON.stringify(value) !== JSON.stringify(initialRef.current);
    setStatus((prev) => {
      if (prev === 'saving') return prev;
      if (isDirty) return 'dirty';
      if (prev === 'saved') return prev;
      return 'idle';
    });
  }, [value]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const onSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      setStatus('saving');
      setError(undefined);
      const res = await save(value);
      if ('error' in res) {
        setStatus('error');
        setError(res.error);
        return;
      }
      initialRef.current = value;
      setStatus('saved');
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setStatus('idle'), 2400);
    },
    [value, save]
  );

  const update = useCallback((updater: (prev: T) => T) => {
    setValue((prev) => updater(prev));
  }, []);

  const set = useCallback((next: T) => setValue(next), []);

  return { value, update, set, status, error, onSubmit };
}
