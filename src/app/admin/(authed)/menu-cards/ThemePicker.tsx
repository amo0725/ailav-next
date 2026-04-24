'use client';

import type { MenuTheme } from '@/lib/content/types';

type Props = {
  value: MenuTheme;
  onChange: (next: MenuTheme) => void;
};

const PRESETS: Array<{ label: string; theme: MenuTheme }> = [
  { label: '赤陶', theme: { bg: '#b0532f', fg: '#1a0f08', accent: '#1a0f08' } },
  { label: '橄欖', theme: { bg: '#7e8a3e', fg: '#1a1a08', accent: '#1a1a08' } },
  { label: '墨黑', theme: { bg: '#1a1a18', fg: '#e9e3d5', accent: '#c4a882' } },
  { label: '米白', theme: { bg: '#f5f4f0', fg: '#1a1a18', accent: '#8b7355' } },
  { label: '酒紅', theme: { bg: '#5c1f25', fg: '#f0e6d2', accent: '#d9b676' } },
];

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="adm-color-input">
      <span className="adm-color-input-label">{label}</span>
      <span className="adm-color-input-controls">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} 色票`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          aria-label={`${label} hex 色碼`}
        />
      </span>
    </label>
  );
}

export default function ThemePicker({ value, onChange }: Props) {
  return (
    <div>
      <div className="adm-theme-presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className="adm-theme-preset"
            onClick={() => onChange(p.theme)}
            style={{
              background: p.theme.bg,
              color: p.theme.fg,
            }}
            title={`套用：${p.label}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="adm-theme-grid">
        <ColorInput label="背景" value={value.bg} onChange={(bg) => onChange({ ...value, bg })} />
        <ColorInput label="文字" value={value.fg} onChange={(fg) => onChange({ ...value, fg })} />
        <ColorInput label="強調" value={value.accent} onChange={(accent) => onChange({ ...value, accent })} />
      </div>
      <div
        className="adm-theme-preview"
        style={{ background: value.bg, color: value.fg }}
      >
        <span style={{ letterSpacing: '0.32em', fontSize: '.7rem', opacity: 0.7 }}>PREVIEW</span>
        <p style={{ fontFamily: 'var(--font-cormorant, serif)', fontStyle: 'italic', margin: '4px 0 0' }}>
          a 4-course tasting menu
        </p>
        <span style={{ color: value.accent, fontSize: '.78rem', letterSpacing: '0.18em' }}>NT 990.</span>
      </div>
    </div>
  );
}
