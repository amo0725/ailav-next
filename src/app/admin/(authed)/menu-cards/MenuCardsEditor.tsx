'use client';

import { useState } from 'react';
import type { MenuCard } from '@/lib/content/types';
import { updateMenuCards } from '@/app/actions/content';
import SaveBar from '@/components/admin/SaveBar';
import { useEditorForm } from '@/components/admin/useEditorForm';
import { useBeforeUnload } from '@/lib/hooks/useBeforeUnload';
import MenuCardEditor from './MenuCardEditor';

type Props = {
  initial: MenuCard[];
  seedTemplate: MenuCard[];
};

function emptyCard(): MenuCard {
  return {
    id: 'card-' + Math.random().toString(36).slice(2, 8),
    slug: 'card-' + Math.random().toString(36).slice(2, 6),
    kind: 'a-la-carte',
    name: '',
    subtitle: '',
    footnote: '',
    theme: { bg: '#f5f4f0', fg: '#1a1a18', accent: '#8b7355' },
    items: [
      {
        id: 'item-' + Math.random().toString(36).slice(2, 8),
        titleZh: '',
        titleEn: '',
        price: '',
        image: '',
        note: '',
      },
    ],
  };
}

// Re-key the seed cards so a second click of "load template" doesn't collide
// with cards already loaded (or with cards the admin has created themselves).
// Also re-suffixes `slug` — otherwise multiple appends would produce duplicate
// `tasting` / `after-hours` slugs and the /menu#slug anchors would collide.
function freshenIds(cards: MenuCard[]): MenuCard[] {
  const suffix = Math.random().toString(36).slice(2, 6);
  return cards.map((card) => {
    const rekeyed = {
      ...card,
      id: `${card.id}-${suffix}`,
      slug: `${card.slug}-${suffix}`,
    };
    if (rekeyed.kind === 'tasting') {
      return {
        ...rekeyed,
        courses: rekeyed.courses.map((c) => ({
          ...c,
          id: `${c.id}-${suffix}`,
          items: c.items.map((it) => ({ ...it, id: `${it.id}-${suffix}` })),
        })),
      };
    }
    return {
      ...rekeyed,
      items: rekeyed.items.map((it) => ({ ...it, id: `${it.id}-${suffix}` })),
    };
  });
}

export default function MenuCardsEditor({ initial, seedTemplate }: Props) {
  const { value, update, status, error, onSubmit } = useEditorForm<MenuCard[]>(
    initial,
    async (next) => updateMenuCards(next)
  );
  useBeforeUnload(status === 'dirty');
  const [openIdx, setOpenIdx] = useState<number | null>(
    initial.length > 0 ? 0 : null
  );

  const patchCard = (
    i: number,
    patch: Partial<MenuCard> | ((prev: MenuCard) => MenuCard)
  ) => {
    update((cards) =>
      cards.map((m, idx) => {
        if (idx !== i) return m;
        return typeof patch === 'function' ? patch(m) : ({ ...m, ...patch } as MenuCard);
      })
    );
  };

  const addCard = () => {
    setOpenIdx(value.length);
    update((cards) => [...cards, emptyCard()]);
  };

  const removeCard = (i: number) => {
    if (!confirm('確定刪除此菜單卡？')) return;
    update((cards) => cards.filter((_, idx) => idx !== i));
    setOpenIdx((o) => (o === i ? null : o !== null && o > i ? o - 1 : o));
  };

  const moveCard = (i: number, dir: -1 | 1) => {
    update((cards) => {
      const j = i + dir;
      if (j < 0 || j >= cards.length) return cards;
      const next = [...cards];
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

  // Replaces the editor contents with the seed template (赤陶 + 橄欖 範例).
  // Doesn't write to the blob — admin still has to click 儲存 to commit.
  const loadSeedTemplate = (mode: 'replace' | 'append') => {
    if (mode === 'replace' && value.length > 0) {
      if (!confirm(`確定覆蓋目前的 ${value.length} 張菜單卡？目前內容不會自動備份。`)) {
        return;
      }
    }
    const fresh = freshenIds(seedTemplate);
    if (mode === 'replace') {
      setOpenIdx(0);
      update(() => fresh);
    } else {
      setOpenIdx(value.length);
      update((cards) => [...cards, ...fresh]);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {value.length === 0 && (
        <div className="adm-alert" style={{ borderLeftColor: 'var(--adm-accent)' }}>
          <p style={{ margin: 0, fontWeight: 500, color: 'var(--adm-fg)' }}>
            目前沒有任何菜單卡
          </p>
          <p style={{ margin: '4px 0 12px' }}>
            點下方按鈕載入兩張範例菜單卡（赤陶 Tasting + 橄欖 After Hours），檢查無誤後按「儲存變更」即可寫入。
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="adm-btn small"
              onClick={() => loadSeedTemplate('replace')}
            >
              載入兩張範例菜單卡
            </button>
            <button
              type="button"
              className="adm-btn ghost small"
              onClick={addCard}
            >
              + 從空白開始
            </button>
          </div>
        </div>
      )}

      {value.map((card, i) => (
        <MenuCardEditor
          key={card.id}
          card={card}
          index={i}
          total={value.length}
          isOpen={openIdx === i}
          onToggle={() => setOpenIdx((o) => (o === i ? null : i))}
          onPatch={(patch) => patchCard(i, patch)}
          onMove={(dir) => moveCard(i, dir)}
          onRemove={() => removeCard(i)}
        />
      ))}

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        {value.length > 0 ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="adm-btn ghost small"
              onClick={() => loadSeedTemplate('append')}
              title="把兩張範例菜單卡加在現有清單後面"
            >
              ＋ 追加範例
            </button>
            <button
              type="button"
              className="adm-btn ghost small"
              onClick={() => loadSeedTemplate('replace')}
              title="清空現有清單，改為兩張範例菜單卡"
            >
              ⟲ 覆蓋為範例
            </button>
          </div>
        ) : (
          <span />
        )}
        <button type="button" className="adm-btn ghost" onClick={addCard}>
          + 新增菜單卡
        </button>
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
