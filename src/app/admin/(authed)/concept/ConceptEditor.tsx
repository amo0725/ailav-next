'use client';

import type { Concept } from '@/lib/content/types';
import { updateConcept } from '@/app/actions/content';
import Field from '@/components/admin/Field';
import SaveBar from '@/components/admin/SaveBar';
import ImageAssetField from '@/components/admin/ImageAssetField';
import { useEditorForm } from '@/components/admin/useEditorForm';
import { useBeforeUnload } from '@/lib/hooks/useBeforeUnload';
import type { ImageAsset } from '@/lib/content/image';

const CONCEPT_PREVIEWS = [
  { label: '桌機 3:4', ratio: 3 / 4 },
  { label: '手機 全寬', ratio: 4 / 5 },
];

export default function ConceptEditor({ initial }: { initial: Concept }) {
  const { value, update, status, error, onSubmit } = useEditorForm<Concept>(
    initial,
    async (next) => updateConcept(next)
  );
  useBeforeUnload(status === 'dirty');

  function updateParagraph(i: number, text: string) {
    update((v) => ({
      ...v,
      paragraphs: v.paragraphs.map((p, idx) => (idx === i ? text : p)),
    }));
  }

  function addParagraph() {
    update((v) => ({ ...v, paragraphs: [...v.paragraphs, ''] }));
  }

  function removeParagraph(i: number) {
    update((v) => ({
      ...v,
      paragraphs: v.paragraphs.filter((_, idx) => idx !== i),
    }));
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="adm-card">
        <Field
          label="標題"
          htmlFor="heading"
          hint="使用全形逗號「，」會自動換行"
        >
          <input
            id="heading"
            type="text"
            value={value.heading}
            onChange={(e) => update((v) => ({ ...v, heading: e.target.value }))}
          />
        </Field>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>段落內容</h3>
          <button type="button" className="adm-btn subtle small" onClick={addParagraph}>
            + 新增段落
          </button>
        </div>
        {value.paragraphs.map((p, i) => (
          <div key={i} className="adm-array-item">
            <div className="adm-array-item-head">
              <h4>段落 {i + 1}</h4>
              <div className="adm-array-item-actions">
                <button
                  type="button"
                  className="adm-icon-btn danger"
                  onClick={() => removeParagraph(i)}
                  disabled={value.paragraphs.length <= 1}
                  title="刪除段落"
                >
                  ×
                </button>
              </div>
            </div>
            <textarea
              value={p}
              rows={3}
              onChange={(e) => updateParagraph(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>主視覺圖片</h3>
        </div>
        <ImageAssetField
          value={value.image}
          onChange={(asset: ImageAsset) => update((v) => ({ ...v, image: asset }))}
          uploadAspect="3 / 4"
          previewAspects={CONCEPT_PREVIEWS}
          hint="建議直向構圖（3:4）；展示於 Concept 區塊右側"
        />
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
