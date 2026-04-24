'use client';

import type { Hero } from '@/lib/content/types';
import { updateHero } from '@/app/actions/content';
import Field from '@/components/admin/Field';
import SaveBar from '@/components/admin/SaveBar';
import ImageAssetField from '@/components/admin/ImageAssetField';
import { useEditorForm } from '@/components/admin/useEditorForm';
import { toAsset, type ImageAsset } from '@/lib/content/image';

// Hero scatter slot aspect ratios (mirror the .gi-N CSS in globals.css).
const SCATTER_ASPECTS: Record<string, { ratio: number; label: string }> = {
  'gi-1': { ratio: 4 / 5, label: '4:5' },
  'gi-2': { ratio: 5 / 3, label: '5:3' },
  'gi-3': { ratio: 1, label: '1:1' },
  'gi-4': { ratio: 3 / 4, label: '3:4' },
  'gi-5': { ratio: 21 / 9, label: '21:9' },
};

const HERO_PREVIEWS = [
  { label: '桌機 16:9', ratio: 16 / 9 },
  { label: '手機 9:16', ratio: 9 / 16 },
  { label: 'iPad 4:3', ratio: 4 / 3 },
];

export default function HeroEditor({ initial }: { initial: Hero }) {
  const { value, update, status, error, onSubmit } = useEditorForm<Hero>(
    initial,
    async (next) => updateHero(next)
  );

  function patchScatter(i: number, p: Partial<Hero['scatterImages'][number]>) {
    update((v) => ({
      ...v,
      scatterImages: v.scatterImages.map((s, idx) =>
        idx === i ? { ...s, ...p } : s
      ),
    }));
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="adm-card">
        <div className="adm-card-head">
          <h3>主圖</h3>
          <span className="hint">全螢幕背景，往下捲動會縮小</span>
        </div>
        <ImageAssetField
          value={value.mainImage}
          onChange={(asset: ImageAsset) =>
            update((v) => ({ ...v, mainImage: asset }))
          }
          uploadAspect="16 / 9"
          previewAspects={HERO_PREVIEWS}
          hint="建議橫幅高解析（1920×1080 以上）；點圖設定焦點，桌機/手機都會以這個焦點為中心裁切"
        />
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>Scatter 小圖</h3>
          <span className="hint">5 張，每張容器比例不同（顯示在預覽中）</span>
        </div>
        {value.scatterImages.map((img, i) => {
          const asset = toAsset(img.src);
          const slot = SCATTER_ASPECTS[img.className];
          const previews = slot
            ? [
                { label: `本位 ${slot.label}`, ratio: slot.ratio },
                { label: '手機', ratio: slot.ratio },
              ]
            : undefined;
          return (
            <div key={img.className} className="adm-array-item">
              <div className="adm-array-item-head">
                <h4>
                  {img.className.toUpperCase()}
                  {slot && (
                    <span style={{ color: 'var(--adm-fg3)', marginLeft: 8, fontWeight: 400 }}>
                      容器比例 {slot.label}
                    </span>
                  )}
                </h4>
              </div>
              <ImageAssetField
                value={asset}
                onChange={(next: ImageAsset) =>
                  patchScatter(i, { src: next, alt: next.alt ?? img.alt })
                }
                uploadAspect={slot ? String(slot.ratio) : '3 / 4'}
                previewAspects={previews}
                altOwnedExternally
              />
              <Field label="替代文字 (Alt)" hint="給搜尋引擎與輔助閱讀器的描述">
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => patchScatter(i, { alt: e.target.value })}
                />
              </Field>
            </div>
          );
        })}
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
