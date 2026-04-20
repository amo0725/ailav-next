'use client';

import { useState } from 'react';
import type { Chef } from '@/lib/content/types';
import { updateChefs } from '@/app/actions/content';
import SaveBar from '@/components/admin/SaveBar';
import { useEditorForm } from '@/components/admin/useEditorForm';
import ChefCard from './ChefCard';

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

  // All mutation helpers use functional updates, so rapid-fire clicks cannot
  // read stale state from closure (avoids the previous bug where two
  // "add award" clicks in one tick could drop the second addition).
  const patchChef = (i: number, patch: Partial<Chef> | ((prev: Chef) => Chef)) => {
    update((chefs) =>
      chefs.map((c, idx) => {
        if (idx !== i) return c;
        return typeof patch === 'function' ? patch(c) : { ...c, ...patch };
      })
    );
  };

  const addChef = () => {
    update((chefs) => {
      const next = [...chefs, emptyChef()];
      setOpenIdx(next.length - 1);
      return next;
    });
  };

  const removeChef = (i: number) => {
    if (!confirm('確定刪除此主廚？')) return;
    update((chefs) => chefs.filter((_, idx) => idx !== i));
    setOpenIdx((o) => (o === i ? null : o !== null && o > i ? o - 1 : o));
  };

  const moveChef = (i: number, dir: -1 | 1) => {
    update((chefs) => {
      const j = i + dir;
      if (j < 0 || j >= chefs.length) return chefs;
      const next = [...chefs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setOpenIdx((o) => {
      const j = i + dir;
      if (o === i) return j;
      if (o === j) return i;
      return o;
    });
  };

  return (
    <form onSubmit={onSubmit}>
      {value.map((chef, i) => (
        <ChefCard
          key={chef.id}
          chef={chef}
          index={i}
          total={value.length}
          isOpen={openIdx === i}
          onToggle={() => setOpenIdx((o) => (o === i ? null : i))}
          onPatch={(patch) => patchChef(i, patch)}
          onMove={(dir) => moveChef(i, dir)}
          onRemove={() => removeChef(i)}
        />
      ))}

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="adm-btn ghost" onClick={addChef}>
          + 新增主廚
        </button>
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
