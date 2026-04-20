'use client';

import { useState } from 'react';
import type { Chef } from '@/lib/content/types';
import { updateChefs } from '@/app/actions/content';
import Field from '@/components/admin/Field';
import SaveBar from '@/components/admin/SaveBar';
import ImageGallery from '@/components/admin/ImageGallery';
import { useEditorForm } from '@/components/admin/useEditorForm';

function emptyChef(): Chef {
  return {
    id: 'chef-' + Math.random().toString(36).slice(2, 8),
    name: '',
    images: [],
    bio: [''],
    awards: [],
    flip: false,
  };
}

export default function ChefsEditor({ initial }: { initial: Chef[] }) {
  const { value, update, status, error, onSubmit } = useEditorForm<Chef[]>(
    initial,
    async (next) => updateChefs(next)
  );
  const [openIdx, setOpenIdx] = useState<number | null>(
    initial.length > 0 ? 0 : null
  );

  function patchChef(i: number, patch: Partial<Chef>) {
    update((chefs) => chefs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function addChef() {
    update((chefs) => {
      const next = [...chefs, emptyChef()];
      setOpenIdx(next.length - 1);
      return next;
    });
  }

  function removeChef(i: number) {
    if (!confirm('確定刪除此主廚？')) return;
    update((chefs) => chefs.filter((_, idx) => idx !== i));
    setOpenIdx((o) => (o === i ? null : o !== null && o > i ? o - 1 : o));
  }

  function moveChef(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    update((chefs) => {
      const next = [...chefs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setOpenIdx((o) => (o === i ? j : o === j ? i : o));
  }

  function addBio(i: number) {
    patchChef(i, { bio: [...value[i].bio, ''] });
  }
  function removeBio(i: number, bi: number) {
    patchChef(i, { bio: value[i].bio.filter((_, idx) => idx !== bi) });
  }
  function editBio(i: number, bi: number, text: string) {
    patchChef(i, {
      bio: value[i].bio.map((b, idx) => (idx === bi ? text : b)),
    });
  }
  function addAward(i: number) {
    patchChef(i, {
      awards: [...value[i].awards, { stat: '', label: '' }],
    });
  }
  function removeAward(i: number, ai: number) {
    patchChef(i, { awards: value[i].awards.filter((_, idx) => idx !== ai) });
  }
  function editAward(i: number, ai: number, key: 'stat' | 'label', text: string) {
    patchChef(i, {
      awards: value[i].awards.map((a, idx) =>
        idx === ai ? { ...a, [key]: text } : a
      ),
    });
  }

  return (
    <form onSubmit={onSubmit}>
      {value.map((chef, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={chef.id} className="adm-card">
            <div
              className="adm-card-head"
              style={{ cursor: 'pointer', marginBottom: isOpen ? 20 : 0 }}
              onClick={() => setOpenIdx((o) => (o === i ? null : i))}
            >
              <h3>
                <span style={{ color: 'var(--adm-fg3)', fontSize: '.8rem', marginRight: 10 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {chef.name || '（未命名主廚）'}
                <span style={{ color: 'var(--adm-fg3)', marginLeft: 12, fontSize: '.75rem' }}>
                  {chef.images.length} 張圖片 · {isOpen ? '收起 ▲' : '展開 ▼'}
                </span>
              </h3>
              <div className="adm-array-item-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="adm-icon-btn"
                  onClick={() => moveChef(i, -1)}
                  disabled={i === 0}
                  title="上移"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-icon-btn"
                  onClick={() => moveChef(i, 1)}
                  disabled={i === value.length - 1}
                  title="下移"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="adm-icon-btn danger"
                  onClick={() => removeChef(i)}
                  disabled={value.length <= 1}
                  title="刪除"
                >
                  ×
                </button>
              </div>
            </div>

            {isOpen && (
              <>
                <Field label="姓名" hint="格式建議：「中文名 — English Name」">
                  <input
                    type="text"
                    value={chef.name}
                    onChange={(e) => patchChef(i, { name: e.target.value })}
                  />
                </Field>

                <Field label="識別代號 (ID)" hint="英文、數字、連字號，用於 URL 與內部標識">
                  <input
                    type="text"
                    value={chef.id}
                    onChange={(e) => patchChef(i, { id: e.target.value })}
                  />
                </Field>

                <div className="adm-field row">
                  <input
                    id={`flip-${i}`}
                    type="checkbox"
                    checked={chef.flip}
                    onChange={(e) => patchChef(i, { flip: e.target.checked })}
                  />
                  <label htmlFor={`flip-${i}`} style={{ textTransform: 'none', letterSpacing: 0 }}>
                    圖片置於右側（反轉版面）
                  </label>
                </div>

                <div className="adm-divider" />

                <h4 style={{ marginBottom: 12, fontSize: '.85rem', color: 'var(--adm-fg2)' }}>
                  圖片（hover 時依序切換；第一張為預設封面）
                </h4>
                <ImageGallery
                  values={chef.images}
                  onChange={(next) => patchChef(i, { images: next })}
                  max={8}
                  hint="建議直向構圖（4:5），至少 2 張才能觸發 hover 切換"
                />

                <div className="adm-divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h4 style={{ margin: 0, fontSize: '.85rem', color: 'var(--adm-fg2)' }}>生平段落</h4>
                  <button type="button" className="adm-btn subtle small" onClick={() => addBio(i)}>
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
                        onClick={() => removeBio(i, bi)}
                        disabled={chef.bio.length <= 1}
                      >
                        ×
                      </button>
                    </div>
                    <textarea
                      value={b}
                      rows={3}
                      onChange={(e) => editBio(i, bi, e.target.value)}
                    />
                  </div>
                ))}

                <div className="adm-divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h4 style={{ margin: 0, fontSize: '.85rem', color: 'var(--adm-fg2)' }}>獎項 / 標籤</h4>
                  <button type="button" className="adm-btn subtle small" onClick={() => addAward(i)}>
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
                        onClick={() => removeAward(i, ai)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="adm-grid-2">
                      <Field label="標題 (stat)" hint="如：米其林、★★、#26">
                        <input
                          type="text"
                          value={a.stat}
                          onChange={(e) => editAward(i, ai, 'stat', e.target.value)}
                        />
                      </Field>
                      <Field label="說明 (label)" hint="可用 \n 換行">
                        <textarea
                          value={a.label}
                          rows={2}
                          onChange={(e) => editAward(i, ai, 'label', e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="adm-btn ghost" onClick={addChef}>
          + 新增主廚
        </button>
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
