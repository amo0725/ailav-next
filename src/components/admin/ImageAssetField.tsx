'use client';

import { useId, useRef, useState } from 'react';
import { toAsset, type FocalPoint, type ImageAsset, type ImageInput } from '@/lib/content/image';
import FocalPointPicker, { type AspectPreview } from './FocalPointPicker';

type Props = {
  value: ImageInput | undefined;
  onChange: (next: ImageAsset) => void;
  // Optional remove handler — when provided shows a "clear" button.
  onRemove?: () => void;
  // Aspect of the placeholder/preview frame BEFORE upload. Once an image
  // is uploaded the picker switches to the natural aspect of that image.
  uploadAspect?: string;
  // Aspect ratios shown in the focal-point picker's live preview row.
  // Defaults to 1:1, 4:5, 16:9, 9:16. Pass [{label:'4:5', ratio:4/5}, ...]
  // to match a specific section's container shape.
  previewAspects?: AspectPreview[];
  // Minimum-effort section hint shown above the picker.
  hint?: string;
  // Hide the alt-text input (e.g. for fields whose alt is owned outside
  // of the asset, like Hero scatter images).
  altOwnedExternally?: boolean;
};

const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageAssetField({
  value,
  onChange,
  onRemove,
  uploadAspect,
  previewAspects,
  hint,
  altOwnedExternally,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Stable per-instance id so two fields rendering the same image URL still
  // get unique label/htmlFor associations (slice-of-URL collided previously).
  const altInputId = useId();

  const asset = toAsset(value);
  const hasImage = !!asset.src;

  const patch = (next: Partial<ImageAsset>) => {
    onChange({ ...asset, ...next });
  };

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('只接受圖片檔案');
      return;
    }
    if (file.size > MAX_SIZE) {
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
      // New upload resets focal to centre — admin will pick again if needed.
      onChange({ src: url, focal: undefined, alt: asset.alt });
    } catch (e) {
      setError(e instanceof Error ? e.message : '上傳失敗');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="adm-asset">
      {!hasImage && (
        <div
          className="adm-image-preview"
          style={uploadAspect ? { aspectRatio: uploadAspect } : undefined}
        >
          <div className="adm-image-placeholder">尚未設定圖片</div>
        </div>
      )}

      {hasImage && (
        <FocalPointPicker
          src={asset.src}
          focal={asset.focal}
          onChange={(focal: FocalPoint) => patch({ focal })}
          previewAspects={previewAspects}
        />
      )}

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
          {uploading ? '上傳中…' : hasImage ? '更換圖片' : '上傳圖片'}
        </button>
        {hasImage && onRemove && (
          <button
            type="button"
            className="adm-btn subtle small"
            onClick={() => {
              onRemove();
              setError(null);
            }}
          >
            清除
          </button>
        )}
      </div>

      {hasImage && !altOwnedExternally && (
        <div className="adm-asset-alt">
          <label htmlFor={altInputId}>
            替代文字 (Alt)
          </label>
          <input
            id={altInputId}
            type="text"
            value={asset.alt ?? ''}
            placeholder="給搜尋引擎與輔助閱讀器的描述"
            onChange={(e) => patch({ alt: e.target.value })}
          />
        </div>
      )}

      {error && (
        <p className="err" style={{ marginTop: 6, color: 'var(--adm-danger)', fontSize: '.8rem' }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="hint" style={{ marginTop: 6, color: 'var(--adm-fg3)', fontSize: '.76rem' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
