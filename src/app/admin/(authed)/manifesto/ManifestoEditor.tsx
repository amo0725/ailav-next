'use client';

import type { Manifesto, ManifestoWord } from '@/lib/content/types';
import { updateManifesto } from '@/app/actions/content';
import Field from '@/components/admin/Field';
import SaveBar from '@/components/admin/SaveBar';
import ImageAssetField from '@/components/admin/ImageAssetField';
import { useEditorForm } from '@/components/admin/useEditorForm';
import { useBeforeUnload } from '@/lib/hooks/useBeforeUnload';
import type { ImageAsset } from '@/lib/content/image';

const POSTER_PREVIEWS = [
  { label: '桌機 2.2:1', ratio: 2.2 },
  { label: '平板 16:9', ratio: 16 / 9 },
  { label: '手機 4:3', ratio: 4 / 3 },
];

export default function ManifestoEditor({ initial }: { initial: Manifesto }) {
  const { value, update, status, error, onSubmit } = useEditorForm<Manifesto>(
    initial,
    async (next) => updateManifesto(next)
  );
  useBeforeUnload(status === 'dirty');

  function patchWord(i: number, p: Partial<ManifestoWord>) {
    update((v) => ({
      ...v,
      words: v.words.map((w, idx) => (idx === i ? { ...w, ...p } : w)),
    }));
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="adm-card">
        <div className="adm-card-head">
          <h3>三個詞</h3>
          <span className="hint">固定三組</span>
        </div>
        {value.words.map((w, i) => (
          <div key={i} className="adm-array-item">
            <div className="adm-array-item-head">
              <h4>{String(i + 1).padStart(2, '0')}</h4>
            </div>
            <div className="adm-grid-2">
              <Field label="法文 (fr)">
                <input type="text" value={w.fr} onChange={(e) => patchWord(i, { fr: e.target.value })} />
              </Field>
              <Field label="英文 (en)">
                <input type="text" value={w.en} onChange={(e) => patchWord(i, { en: e.target.value })} />
              </Field>
            </div>
            <Field label="中文說明 (zh)">
              <input type="text" value={w.zh} onChange={(e) => patchWord(i, { zh: e.target.value })} />
            </Field>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>影片</h3>
        </div>
        <Field label="影片網址 (.mp4)" hint="完整網址，建議外部 CDN">
          <input
            type="url"
            value={value.videoUrl}
            onChange={(e) => update((v) => ({ ...v, videoUrl: e.target.value }))}
          />
        </Field>
        <div style={{ marginTop: 14 }}>
          <h4 style={{ fontSize: '.85rem', color: 'var(--adm-fg2)', marginBottom: 10 }}>
            海報圖（影片尚未載入時顯示）
          </h4>
          <ImageAssetField
            value={value.posterImage}
            onChange={(asset: ImageAsset) =>
              update((v) => ({ ...v, posterImage: asset }))
            }
            uploadAspect="2.2 / 1"
            previewAspects={POSTER_PREVIEWS}
          />
        </div>
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
