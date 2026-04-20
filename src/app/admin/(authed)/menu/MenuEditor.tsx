'use client';

import type { MenuItem } from '@/lib/content/types';
import { updateMenu } from '@/app/actions/content';
import Field from '@/components/admin/Field';
import SaveBar from '@/components/admin/SaveBar';
import { useEditorForm } from '@/components/admin/useEditorForm';

function emptyItem(): MenuItem {
  return {
    id: 'item-' + Math.random().toString(36).slice(2, 8),
    title: '',
    price: '',
    description: '',
    note: '',
  };
}

export default function MenuEditor({ initial }: { initial: MenuItem[] }) {
  const { value, update, status, error, onSubmit } = useEditorForm<MenuItem[]>(
    initial,
    async (next) => updateMenu(next)
  );

  function patch(i: number, p: Partial<MenuItem>) {
    update((items) => items.map((it, idx) => (idx === i ? { ...it, ...p } : it)));
  }
  function add() {
    update((items) => [...items, emptyItem()]);
  }
  function remove(i: number) {
    if (!confirm('確定刪除此項目？')) return;
    update((items) => items.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    update((items) => {
      const next = [...items];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <form onSubmit={onSubmit}>
      {value.map((item, i) => (
        <div key={item.id} className="adm-card">
          <div className="adm-card-head">
            <h3>
              <span style={{ color: 'var(--adm-fg3)', fontSize: '.8rem', marginRight: 10 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.title || '（未命名項目）'}
            </h3>
            <div className="adm-array-item-actions">
              <button type="button" className="adm-icon-btn" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="adm-icon-btn" onClick={() => move(i, 1)} disabled={i === value.length - 1}>↓</button>
              <button type="button" className="adm-icon-btn danger" onClick={() => remove(i)} disabled={value.length <= 1}>×</button>
            </div>
          </div>
          <Field label="識別代號 (ID)">
            <input type="text" value={item.id} onChange={(e) => patch(i, { id: e.target.value })} />
          </Field>
          <div className="adm-grid-2">
            <Field label="標題">
              <input type="text" value={item.title} onChange={(e) => patch(i, { title: e.target.value })} />
            </Field>
            <Field label="價格" hint="如 NT$ 990 / 位">
              <input type="text" value={item.price} onChange={(e) => patch(i, { price: e.target.value })} />
            </Field>
          </div>
          <Field label="內容描述">
            <textarea value={item.description} rows={3} onChange={(e) => patch(i, { description: e.target.value })} />
          </Field>
          <Field label="備註" hint="支援換行（按 Enter）；如營業時段、是否接受訂位">
            <textarea value={item.note} rows={2} onChange={(e) => patch(i, { note: e.target.value })} />
          </Field>
        </div>
      ))}

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="adm-btn ghost" onClick={add}>
          + 新增項目
        </button>
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
