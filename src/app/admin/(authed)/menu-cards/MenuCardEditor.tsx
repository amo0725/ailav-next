'use client';

import type { MenuCard, MenuCardCourse, MenuDish } from '@/lib/content/types';
import Field from '@/components/admin/Field';
import ThemePicker from './ThemePicker';
import MenuDishRow from './MenuDishRow';

type Props = {
  card: MenuCard;
  index: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  onPatch: (patch: Partial<MenuCard> | ((prev: MenuCard) => MenuCard)) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
};

function emptyDish(): MenuDish {
  return {
    id: 'item-' + Math.random().toString(36).slice(2, 8),
    titleZh: '',
    titleEn: '',
    price: '',
    image: '',
    note: '',
  };
}

function emptyCourse(): MenuCardCourse {
  return {
    id: 'course-' + Math.random().toString(36).slice(2, 8),
    heading: '',
    items: [emptyDish()],
  };
}

// Switch the card's `kind` while preserving as much data as possible:
// flatten courses → items when going tasting → a-la-carte; wrap items into a
// single course when going the other way.
function switchKind(card: MenuCard, nextKind: MenuCard['kind']): MenuCard {
  if (card.kind === nextKind) return card;
  const base = {
    id: card.id,
    slug: card.slug,
    name: card.name,
    subtitle: card.subtitle,
    theme: card.theme,
    footnote: card.footnote,
  };
  if (nextKind === 'tasting') {
    const items = (card as Extract<MenuCard, { kind: 'a-la-carte' }>).items;
    return {
      ...base,
      kind: 'tasting',
      courses: [
        {
          id: 'course-' + Math.random().toString(36).slice(2, 8),
          heading: 'COURSE',
          items: items.length > 0 ? items : [emptyDish()],
        },
      ],
    };
  }
  const courses = (card as Extract<MenuCard, { kind: 'tasting' }>).courses;
  const flat = courses.flatMap((c) => c.items);
  return {
    ...base,
    kind: 'a-la-carte',
    items: flat.length > 0 ? flat : [emptyDish()],
  };
}

export default function MenuCardEditor({
  card,
  index,
  total,
  isOpen,
  onToggle,
  onPatch,
  onMove,
  onRemove,
}: Props) {
  /* ── Dish-level mutations (works for either kind) ─────────────── */

  const patchDish = (
    locator: { courseIdx: number; itemIdx: number } | { itemIdx: number },
    patch: Partial<MenuDish>
  ) => {
    onPatch((prev) => {
      if (prev.kind === 'tasting' && 'courseIdx' in locator) {
        return {
          ...prev,
          courses: prev.courses.map((c, ci) =>
            ci !== locator.courseIdx
              ? c
              : {
                  ...c,
                  items: c.items.map((it, ii) =>
                    ii === locator.itemIdx ? { ...it, ...patch } : it
                  ),
                }
          ),
        };
      }
      if (prev.kind === 'a-la-carte' && !('courseIdx' in locator)) {
        return {
          ...prev,
          items: prev.items.map((it, ii) =>
            ii === locator.itemIdx ? { ...it, ...patch } : it
          ),
        };
      }
      return prev;
    });
  };

  const moveDish = (
    locator: { courseIdx: number; itemIdx: number } | { itemIdx: number },
    dir: -1 | 1
  ) => {
    onPatch((prev) => {
      if (prev.kind === 'tasting' && 'courseIdx' in locator) {
        const target = prev.courses[locator.courseIdx];
        const j = locator.itemIdx + dir;
        if (j < 0 || j >= target.items.length) return prev;
        const next = [...target.items];
        [next[locator.itemIdx], next[j]] = [next[j], next[locator.itemIdx]];
        return {
          ...prev,
          courses: prev.courses.map((c, ci) =>
            ci !== locator.courseIdx ? c : { ...c, items: next }
          ),
        };
      }
      if (prev.kind === 'a-la-carte' && !('courseIdx' in locator)) {
        const j = locator.itemIdx + dir;
        if (j < 0 || j >= prev.items.length) return prev;
        const next = [...prev.items];
        [next[locator.itemIdx], next[j]] = [next[j], next[locator.itemIdx]];
        return { ...prev, items: next };
      }
      return prev;
    });
  };

  const removeDish = (
    locator: { courseIdx: number; itemIdx: number } | { itemIdx: number }
  ) => {
    onPatch((prev) => {
      if (prev.kind === 'tasting' && 'courseIdx' in locator) {
        return {
          ...prev,
          courses: prev.courses.map((c, ci) => {
            if (ci !== locator.courseIdx) return c;
            if (c.items.length <= 1) return c;
            return { ...c, items: c.items.filter((_, ii) => ii !== locator.itemIdx) };
          }),
        };
      }
      if (prev.kind === 'a-la-carte' && !('courseIdx' in locator)) {
        if (prev.items.length <= 1) return prev;
        return {
          ...prev,
          items: prev.items.filter((_, ii) => ii !== locator.itemIdx),
        };
      }
      return prev;
    });
  };

  const addDish = (locator?: { courseIdx: number }) => {
    onPatch((prev) => {
      if (prev.kind === 'tasting' && locator) {
        return {
          ...prev,
          courses: prev.courses.map((c, ci) =>
            ci !== locator.courseIdx ? c : { ...c, items: [...c.items, emptyDish()] }
          ),
        };
      }
      if (prev.kind === 'a-la-carte' && !locator) {
        return { ...prev, items: [...prev.items, emptyDish()] };
      }
      return prev;
    });
  };

  /* ── Course-level mutations (tasting only) ────────────────────── */

  const addCourse = () => {
    onPatch((prev) => {
      if (prev.kind !== 'tasting') return prev;
      return { ...prev, courses: [...prev.courses, emptyCourse()] };
    });
  };

  const removeCourse = (ci: number) => {
    if (!confirm('確定刪除此分組（連同其中所有項目）？')) return;
    onPatch((prev) => {
      if (prev.kind !== 'tasting') return prev;
      if (prev.courses.length <= 1) return prev;
      return { ...prev, courses: prev.courses.filter((_, i) => i !== ci) };
    });
  };

  const moveCourse = (ci: number, dir: -1 | 1) => {
    onPatch((prev) => {
      if (prev.kind !== 'tasting') return prev;
      const j = ci + dir;
      if (j < 0 || j >= prev.courses.length) return prev;
      const next = [...prev.courses];
      [next[ci], next[j]] = [next[j], next[ci]];
      return { ...prev, courses: next };
    });
  };

  const patchCourse = (ci: number, patch: Partial<MenuCardCourse>) => {
    onPatch((prev) => {
      if (prev.kind !== 'tasting') return prev;
      return {
        ...prev,
        courses: prev.courses.map((c, i) => (i === ci ? { ...c, ...patch } : c)),
      };
    });
  };

  const itemCount =
    card.kind === 'tasting'
      ? card.courses.reduce((sum, c) => sum + c.items.length, 0)
      : card.items.length;

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
          aria-controls={`menu-card-body-${card.id}`}
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
            {card.name || '（未命名菜單卡）'}
            <span
              style={{
                color: 'var(--adm-fg3)',
                marginLeft: 12,
                fontSize: '.75rem',
              }}
            >
              {card.kind === 'tasting' ? `${card.courses.length} 課程` : 'à la carte'} · {itemCount} 項 · {isOpen ? '收起 ▲' : '展開 ▼'}
            </span>
          </h3>
        </button>
        <div className="adm-array-item-actions">
          <span
            className="adm-color-swatch"
            style={{ background: card.theme.bg, borderColor: card.theme.fg }}
            aria-hidden
          />
          <button
            type="button"
            className="adm-icon-btn"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="上移"
          >
            ↑
          </button>
          <button
            type="button"
            className="adm-icon-btn"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="下移"
          >
            ↓
          </button>
          <button
            type="button"
            className="adm-icon-btn danger"
            onClick={onRemove}
            aria-label="刪除菜單卡"
          >
            ×
          </button>
        </div>
      </div>

      {isOpen && (
        <div id={`menu-card-body-${card.id}`}>
          <div className="adm-grid-2">
            <Field label="菜單名稱" hint="如：當季品味套餐">
              <input
                type="text"
                value={card.name}
                onChange={(e) => onPatch({ name: e.target.value })}
              />
            </Field>
            <Field label="英文副標" hint="如：COMPLETE TASTING MENU">
              <input
                type="text"
                value={card.subtitle}
                onChange={(e) => onPatch({ subtitle: e.target.value })}
              />
            </Field>
          </div>
          <div className="adm-grid-2">
            <Field label="識別代號 (ID)">
              <input
                type="text"
                value={card.id}
                onChange={(e) => onPatch({ id: e.target.value })}
              />
            </Field>
            <Field label="網址 slug" hint="英文小寫、數字、連字號。/menu#slug 與列印頁會用">
              <input
                type="text"
                value={card.slug}
                onChange={(e) => onPatch({ slug: e.target.value })}
              />
            </Field>
          </div>
          <Field label="版型" hint="tasting：分組式套餐（無單項價格）｜à la carte：單點式（每項有價格）">
            <select
              value={card.kind}
              onChange={(e) => {
                const next = e.target.value as MenuCard['kind'];
                onPatch((prev) => switchKind(prev, next));
              }}
            >
              <option value="tasting">tasting — 套餐分組</option>
              <option value="a-la-carte">à la carte — 單點列表</option>
            </select>
          </Field>
          <Field label="底部備註" hint="如：a 4-course tasting menu　NT 990.">
            <input
              type="text"
              value={card.footnote}
              onChange={(e) => onPatch({ footnote: e.target.value })}
            />
          </Field>

          <div className="adm-divider" />

          <h4 style={{ marginBottom: 12, fontSize: '.85rem', color: 'var(--adm-fg2)' }}>
            主題色
          </h4>
          <ThemePicker
            value={card.theme}
            onChange={(theme) => onPatch({ theme })}
          />

          <div className="adm-divider" />

          {card.kind === 'tasting' ? (
            <>
              <div className="adm-section-head">
                <h4>課程分組（Course Sections）</h4>
                <button type="button" className="adm-btn subtle small" onClick={addCourse}>
                  + 新增分組
                </button>
              </div>
              {card.courses.map((course, ci) => (
                <div key={course.id} className="adm-array-item">
                  <div className="adm-array-item-head">
                    <h4 style={{ width: '100%' }}>
                      <input
                        type="text"
                        value={course.heading}
                        placeholder="如：AMUSE-BOUCHE"
                        onChange={(e) => patchCourse(ci, { heading: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          border: '1px solid var(--adm-border)',
                          borderRadius: 4,
                          background: 'var(--adm-surface)',
                          letterSpacing: '0.18em',
                          fontSize: '.85rem',
                          font: 'inherit',
                        }}
                      />
                    </h4>
                    <div className="adm-array-item-actions">
                      <button
                        type="button"
                        className="adm-icon-btn"
                        onClick={() => moveCourse(ci, -1)}
                        disabled={ci === 0}
                        aria-label="上移"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="adm-icon-btn"
                        onClick={() => moveCourse(ci, 1)}
                        disabled={ci === card.courses.length - 1}
                        aria-label="下移"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="adm-icon-btn danger"
                        onClick={() => removeCourse(ci)}
                        disabled={card.courses.length <= 1}
                        aria-label="刪除分組"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  {course.items.map((item, ii) => (
                    <MenuDishRow
                      key={item.id}
                      item={item}
                      index={ii}
                      total={course.items.length}
                      showPrice={false}
                      onPatch={(p) => patchDish({ courseIdx: ci, itemIdx: ii }, p)}
                      onMove={(d) => moveDish({ courseIdx: ci, itemIdx: ii }, d)}
                      onRemove={() => removeDish({ courseIdx: ci, itemIdx: ii })}
                    />
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button
                      type="button"
                      className="adm-btn subtle small"
                      onClick={() => addDish({ courseIdx: ci })}
                    >
                      + 新增項目
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="adm-section-head">
                <h4>項目（Items）</h4>
                <button type="button" className="adm-btn subtle small" onClick={() => addDish()}>
                  + 新增項目
                </button>
              </div>
              {card.items.map((item, ii) => (
                <MenuDishRow
                  key={item.id}
                  item={item}
                  index={ii}
                  total={card.items.length}
                  showPrice={true}
                  onPatch={(p) => patchDish({ itemIdx: ii }, p)}
                  onMove={(d) => moveDish({ itemIdx: ii }, d)}
                  onRemove={() => removeDish({ itemIdx: ii })}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
