'use client';

import { useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  aspect?: string;
  hint?: string;
};

export default function ImageUpload({ value, onChange, onRemove, aspect, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('只接受圖片檔案');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('檔案過大（上限 10 MB）');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `上傳失敗 (${res.status})`);
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : '上傳失敗');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="adm-image-preview" style={aspect ? { aspectRatio: aspect } : undefined}>
        {value ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value} alt="" />
        ) : (
          <div className="adm-image-placeholder">尚未設定圖片</div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      <div className="adm-image-row">
        <button
          type="button"
          className="adm-btn subtle small"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? '上傳中…' : value ? '更換圖片' : '上傳圖片'}
        </button>
        {value && onRemove && (
          <button type="button" className="adm-btn subtle small" onClick={onRemove}>
            清除
          </button>
        )}
      </div>
      {error && <p className="err" style={{ marginTop: 6, color: 'var(--adm-danger)', fontSize: '.8rem' }}>{error}</p>}
      {hint && !error && <p className="hint" style={{ marginTop: 6, color: 'var(--adm-fg3)', fontSize: '.76rem' }}>{hint}</p>}
    </div>
  );
}
