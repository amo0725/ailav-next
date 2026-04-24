'use client';

import type { MenuDish } from '@/lib/content/types';
import Field from '@/components/admin/Field';
import ImageAssetField from '@/components/admin/ImageAssetField';
import { toAsset, type ImageAsset } from '@/lib/content/image';

const DISH_PREVIEWS = [
  { label: '菜單卡 1:1', ratio: 1 },
  { label: '手機 4:3', ratio: 4 / 3 },
];

type Props = {
  item: MenuDish;
  index: number;
  total: number;
  showPrice: boolean;
  onPatch: (patch: Partial<MenuDish>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
};

export default function MenuDishRow({
  item,
  index,
  total,
  showPrice,
  onPatch,
  onMove,
  onRemove,
}: Props) {
  return (
    <div className="adm-array-item">
      <div className="adm-array-item-head">
        <h4>
          <span style={{ color: 'var(--adm-fg3)', marginRight: 8 }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          {item.titleZh || '（未命名）'}
        </h4>
        <div className="adm-array-item-actions">
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
            disabled={total <= 1}
            aria-label="刪除項目"
          >
            ×
          </button>
        </div>
      </div>

      <div className="adm-menu-item-grid">
        <div>
          <Field label="中文名" hint="如：章魚塔塔 / 煙燻紅椒醬 / 油蔥酥">
            <input
              type="text"
              value={item.titleZh}
              onChange={(e) => onPatch({ titleZh: e.target.value })}
            />
          </Field>
          <Field label="英文名（義式斜體）" hint="可留空；如：Octopus Tartare with Smoked Paprika Sauce">
            <input
              type="text"
              value={item.titleEn}
              onChange={(e) => onPatch({ titleEn: e.target.value })}
            />
          </Field>
          {showPrice && (
            <Field label="價格" hint="如：NT 250.">
              <input
                type="text"
                value={item.price}
                onChange={(e) => onPatch({ price: e.target.value })}
              />
            </Field>
          )}
          <Field label="識別代號 (ID)" hint="英數連字號">
            <input
              type="text"
              value={item.id}
              onChange={(e) => onPatch({ id: e.target.value })}
            />
          </Field>
          <Field label="備註" hint="可留空，如：含 5% 服務費、僅供晚餐">
            <textarea
              value={item.note}
              rows={2}
              onChange={(e) => onPatch({ note: e.target.value })}
            />
          </Field>
        </div>
        <div>
          <Field label="盤式照片" hint="可留空。建議方形構圖（1:1）；點圖設定焦點">
            <ImageAssetField
              value={item.image || undefined}
              onChange={(asset: ImageAsset) => onPatch({ image: asset })}
              onRemove={() => onPatch({ image: '' })}
              uploadAspect="1 / 1"
              previewAspects={DISH_PREVIEWS}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
