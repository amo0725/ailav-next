'use client';

import { useRef, useState } from 'react';
import { toAsset, type ImageAsset, type ImageInput } from '@/lib/content/image';
import FocalPointPicker, { type AspectPreview } from './FocalPointPicker';

type Props = {
  values: ImageInput[];
  onChange: (next: ImageAsset[]) => void;
  max?: number;
  hint?: string;
  previewAspects?: AspectPreview[];
};

const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageAssetGallery({
  values,
  onChange,
  max = 8,
  hint,
  previewAspects,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const assets = values.map((v) => toAsset(v));

  async function uploadFile(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) {
      setError('只接受圖片檔案');
      return null;
    }
    if (file.size > MAX_SIZE) {
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
      const remaining = max - assets.length;
      const toUpload = Array.from(files).slice(0, remaining);
      const next: ImageAsset[] = [...assets];
      for (const f of toUpload) {
        const url = await uploadFile(f);
        if (url) next.push({ src: url });
      }
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : '上傳失敗');
    } finally {
      setUploading(false);
    }
  }

  const patch = (i: number, p: Partial<ImageAsset>) => {
    onChange(assets.map((a, idx) => (idx === i ? { ...a, ...p } : a)));
  };

  const remove = (i: number) => {
    const next = assets.filter((_, idx) => idx !== i);
    setOpenIdx((o) => (o === i ? null : o !== null && o > i ? o - 1 : o));
    onChange(next);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= assets.length) return;
    const next = [...assets];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIdx((o) => {
      if (o === i) return j;
      if (o === j) return i;
      return o;
    });
  };

  return (
    <div>
      <div className="adm-image-gallery">
        {assets.map((a, i) => (
          <div
            key={a.src + i}
            className={`adm-image-gallery-item ${openIdx === i ? 'active' : ''}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.src} alt={a.alt ?? ''} />
            <span className="order">{i + 1}{i === 0 ? ' · 封面' : ''}</span>
            <div className="actions">
              <button
                type="button"
                onClick={() => setOpenIdx((o) => (o === i ? null : i))}
                aria-label={`編輯第 ${i + 1} 張圖片的焦點`}
                title="編輯焦點 / 替代文字"
              >
                ⊕
              </button>
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
                disabled={i === assets.length - 1}
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

      {openIdx !== null && assets[openIdx] && (
        <div className="adm-array-item" style={{ marginTop: 12 }}>
          <div className="adm-array-item-head">
            <h4>編輯第 {openIdx + 1} 張圖片</h4>
            <button
              type="button"
              className="adm-icon-btn"
              onClick={() => setOpenIdx(null)}
              aria-label="收起"
            >
              ▲
            </button>
          </div>
          <FocalPointPicker
            src={assets[openIdx].src}
            focal={assets[openIdx].focal}
            onChange={(focal) => patch(openIdx, { focal })}
            previewAspects={previewAspects}
          />
          <div className="adm-asset-alt" style={{ marginTop: 12 }}>
            <label htmlFor={`alt-${openIdx}`}>替代文字 (Alt)</label>
            <input
              id={`alt-${openIdx}`}
              type="text"
              value={assets[openIdx].alt ?? ''}
              placeholder="給搜尋引擎與輔助閱讀器的描述"
              onChange={(e) => patch(openIdx, { alt: e.target.value })}
            />
          </div>
        </div>
      )}

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
          disabled={uploading || assets.length >= max}
        >
          {uploading ? '上傳中…' : `新增圖片（${assets.length}/${max}）`}
        </button>
      </div>
      {error && <p className="err" style={{ marginTop: 6, color: 'var(--adm-danger)', fontSize: '.8rem' }}>{error}</p>}
      {hint && !error && <p className="hint" style={{ marginTop: 6, color: 'var(--adm-fg3)', fontSize: '.76rem' }}>{hint}</p>}
    </div>
  );
}
