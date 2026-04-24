'use client';

import type { Chef } from '@/lib/content/types';
import Field from '@/components/admin/Field';
import ImageAssetGallery from '@/components/admin/ImageAssetGallery';

const CHEF_PREVIEWS = [
  { label: '桌機 4:5', ratio: 4 / 5 },
  { label: '手機 16:10', ratio: 16 / 10 },
];

type Props = {
  chef: Chef;
  index: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  onPatch: (patch: Partial<Chef> | ((prev: Chef) => Chef)) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
};

export default function ChefCard({
  chef,
  index,
  total,
  isOpen,
  onToggle,
  onPatch,
  onMove,
  onRemove,
}: Props) {
  const patchChef = (p: Partial<Chef>) => onPatch(p);

  const addBio = () =>
    onPatch((prev) => ({ ...prev, bio: [...prev.bio, ''] }));

  const removeBio = (bi: number) =>
    onPatch((prev) => ({ ...prev, bio: prev.bio.filter((_, idx) => idx !== bi) }));

  const editBio = (bi: number, text: string) =>
    onPatch((prev) => ({
      ...prev,
      bio: prev.bio.map((b, idx) => (idx === bi ? text : b)),
    }));

  const addAward = () =>
    onPatch((prev) => ({
      ...prev,
      awards: [...prev.awards, { stat: '', label: '' }],
    }));

  const removeAward = (ai: number) =>
    onPatch((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, idx) => idx !== ai),
    }));

  const editAward = (ai: number, key: 'stat' | 'label', text: string) =>
    onPatch((prev) => ({
      ...prev,
      awards: prev.awards.map((a, idx) => (idx === ai ? { ...a, [key]: text } : a)),
    }));

  return (
    <div className="adm-card">
      <div
        className="adm-card-head"
        style={{ marginBottom: isOpen ? 20 : 0 }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`chef-body-${chef.id}`}
          style={{
            all: 'unset',
            cursor: 'pointer',
            flex: 1,
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            font: 'inherit',
          }}
        >
          <h3 style={{ margin: 0 }}>
            <span style={{ color: 'var(--adm-fg3)', fontSize: '.8rem', marginRight: 10 }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            {chef.name || '（未命名主廚）'}
            <span style={{ color: 'var(--adm-fg3)', marginLeft: 12, fontSize: '.75rem' }}>
              {chef.images.length} 張圖片 · {isOpen ? '收起 ▲' : '展開 ▼'}
            </span>
          </h3>
        </button>
        <div className="adm-array-item-actions">
          <button
            type="button"
            className="adm-icon-btn"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="將主廚上移"
          >
            ↑
          </button>
          <button
            type="button"
            className="adm-icon-btn"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="將主廚下移"
          >
            ↓
          </button>
          <button
            type="button"
            className="adm-icon-btn danger"
            onClick={onRemove}
            disabled={total <= 1}
            aria-label="刪除主廚"
          >
            ×
          </button>
        </div>
      </div>

      {isOpen && (
        <div id={`chef-body-${chef.id}`}>
          <Field label="姓名" hint="格式建議：「中文名 — English Name」">
            <input
              type="text"
              value={chef.name}
              onChange={(e) => patchChef({ name: e.target.value })}
            />
          </Field>

          <Field label="識別代號 (ID)" hint="英文、數字、連字號，用於 URL 與內部標識">
            <input
              type="text"
              value={chef.id}
              onChange={(e) => patchChef({ id: e.target.value })}
            />
          </Field>

          <div className="adm-field row">
            <input
              id={`flip-${chef.id}`}
              type="checkbox"
              checked={chef.flip}
              onChange={(e) => patchChef({ flip: e.target.checked })}
            />
            <label
              htmlFor={`flip-${chef.id}`}
              style={{ textTransform: 'none', letterSpacing: 0 }}
            >
              圖片置於右側（反轉版面）
            </label>
          </div>

          <div className="adm-divider" />

          <h4 style={{ marginBottom: 12, fontSize: '.85rem', color: 'var(--adm-fg2)' }}>
            圖片（hover 時依序切換；第一張為預設封面）
          </h4>
          <ImageAssetGallery
            values={chef.images}
            onChange={(next) => patchChef({ images: next })}
            max={8}
            previewAspects={CHEF_PREVIEWS}
            hint="建議直向構圖（4:5），至少 2 張才能觸發 hover 切換。點 ⊕ 編輯每張圖的焦點與 Alt"
          />

          <div className="adm-divider" />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <h4 style={{ margin: 0, fontSize: '.85rem', color: 'var(--adm-fg2)' }}>
              生平段落
            </h4>
            <button type="button" className="adm-btn subtle small" onClick={addBio}>
              + 新增段落
            </button>
          </div>
          {chef.bio.map((b, bi) => (
            <div key={bi} className="adm-array-item">
              <div className="adm-array-item-head">
                <h4>段落 {bi + 1}</h4>
                <button
                  type="button"
                  className="adm-icon-btn danger"
                  onClick={() => removeBio(bi)}
                  disabled={chef.bio.length <= 1}
                  aria-label={`刪除段落 ${bi + 1}`}
                >
                  ×
                </button>
              </div>
              <textarea
                value={b}
                rows={3}
                onChange={(e) => editBio(bi, e.target.value)}
              />
            </div>
          ))}

          <div className="adm-divider" />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <h4 style={{ margin: 0, fontSize: '.85rem', color: 'var(--adm-fg2)' }}>
              獎項 / 標籤
            </h4>
            <button type="button" className="adm-btn subtle small" onClick={addAward}>
              + 新增獎項
            </button>
          </div>
          {chef.awards.map((a, ai) => (
            <div key={ai} className="adm-array-item">
              <div className="adm-array-item-head">
                <h4>獎項 {ai + 1}</h4>
                <button
                  type="button"
                  className="adm-icon-btn danger"
                  onClick={() => removeAward(ai)}
                  aria-label={`刪除獎項 ${ai + 1}`}
                >
                  ×
                </button>
              </div>
              <div className="adm-grid-2">
                <Field label="標題 (stat)" hint="如：米其林、★★、#26">
                  <input
                    type="text"
                    value={a.stat}
                    onChange={(e) => editAward(ai, 'stat', e.target.value)}
                  />
                </Field>
                <Field label="說明 (label)" hint="可用 \n 換行">
                  <textarea
                    value={a.label}
                    rows={2}
                    onChange={(e) => editAward(ai, 'label', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
