'use client';

import type { Hero } from '@/lib/content/types';
import { updateHero } from '@/app/actions/content';
import Field from '@/components/admin/Field';
import SaveBar from '@/components/admin/SaveBar';
import ImageUpload from '@/components/admin/ImageUpload';
import { useEditorForm } from '@/components/admin/useEditorForm';

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
        <ImageUpload
          value={value.mainImage}
          onChange={(url) => update((v) => ({ ...v, mainImage: url }))}
          aspect="16 / 9"
          hint="建議橫幅高解析（1920×1080 以上）"
        />
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>Scatter 小圖</h3>
          <span className="hint">共 5 張，固定 className 不可更動</span>
        </div>
        {value.scatterImages.map((img, i) => (
          <div key={img.className} className="adm-array-item">
            <div className="adm-array-item-head">
              <h4>{img.className.toUpperCase()}</h4>
            </div>
            <div className="adm-grid-2">
              <div>
                <ImageUpload
                  value={img.src}
                  onChange={(url) => patchScatter(i, { src: url })}
                  aspect="3 / 4"
                />
              </div>
              <div>
                <Field label="替代文字 (Alt)" hint="給搜尋引擎與輔助閱讀器的描述">
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => patchScatter(i, { alt: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
