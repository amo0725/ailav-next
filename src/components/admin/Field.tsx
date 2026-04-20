'use client';

import type { ReactNode } from 'react';

type Props = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
};

export default function Field({ label, hint, error, children, htmlFor }: Props) {
  return (
    <div className="adm-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <p className="hint">{hint}</p>}
      {error && <p className="err">{error}</p>}
    </div>
  );
}
