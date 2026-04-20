'use client';

import { useRef, useState } from 'react';

type Props = {
  values: string[];
  onChange: (next: string[]) => void;
  max?: number;
  hint?: string;
};

export default function ImageGallery({ values, onChange, max = 8, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) {
      setError('只接受圖片檔案');
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('檔案過大（上限 10 MB）');
      return null;
    }
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? '上傳失敗');
    }
    const { url } = (await res.json()) as { url: string };
    return url;
  }

  async function handleFiles(files: FileList) {
    setError(null);
    setUploading(true);
    try {
      const remaining = max - values.length;
      const toUpload = Array.from(files).slice(0, remaining);
      const next: string[] = [...values];
      for (const f of toUpload) {
        const url = await uploadFile(f);
        if (url) next.push(url);
      }
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : '上傳失敗');
    } finally {
      setUploading(false);
    }
  }

  function remove(i: number) {
    const next = values.filter((_, idx) => idx !== i);
    onChange(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <div className="adm-image-gallery">
        {values.map((src, i) => (
          <div key={src + i} className="adm-image-gallery-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" />
            <span className="order">{i + 1}{i === 0 ? ' · 封面' : ''}</span>
            <div className="actions">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={`將第 ${i + 1} 張圖片上移`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === values.length - 1}
                aria-label={`將第 ${i + 1} 張圖片下移`}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`移除第 ${i + 1} 張圖片`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <div className="adm-image-row">
        <button
          type="button"
          className="adm-btn subtle small"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || values.length >= max}
        >
          {uploading ? '上傳中…' : `新增圖片（${values.length}/${max}）`}
        </button>
      </div>
      {error && <p className="err" style={{ marginTop: 6, color: 'var(--adm-danger)', fontSize: '.8rem' }}>{error}</p>}
      {hint && !error && <p className="hint" style={{ marginTop: 6, color: 'var(--adm-fg3)', fontSize: '.76rem' }}>{hint}</p>}
    </div>
  );
}
