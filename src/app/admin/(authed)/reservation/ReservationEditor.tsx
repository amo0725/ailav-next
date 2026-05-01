'use client';

import type { Restaurant, HoursBlock } from '@/lib/content/types';
import { updateRestaurant } from '@/app/actions/content';
import Field from '@/components/admin/Field';
import SaveBar from '@/components/admin/SaveBar';
import { useEditorForm } from '@/components/admin/useEditorForm';
import { useBeforeUnload } from '@/lib/hooks/useBeforeUnload';

type HoursKey = 'mainCourse' | 'tasting' | 'wineBar';

const HOURS_KEYS: { key: HoursKey; title: string }[] = [
  { key: 'mainCourse', title: '主食套餐時段' },
  { key: 'tasting', title: '品味套餐時段' },
  { key: 'wineBar', title: '深夜 Wine Bar 時段' },
];

export default function ReservationEditor({ initial }: { initial: Restaurant }) {
  const { value, update, status, error, onSubmit } = useEditorForm<Restaurant>(
    initial,
    async (next) => updateRestaurant(next)
  );
  useBeforeUnload(status === 'dirty');

  function patchHours(key: HoursKey, p: Partial<HoursBlock>) {
    update((v) => ({
      ...v,
      hours: { ...v.hours, [key]: { ...v.hours[key], ...p } },
    }));
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="adm-card">
        <div className="adm-card-head">
          <h3>基本資訊</h3>
        </div>
        <Field label="地址">
          <input
            type="text"
            value={value.address}
            onChange={(e) => update((v) => ({ ...v, address: e.target.value }))}
          />
        </Field>
        <div className="adm-grid-2">
          <Field label="緯度 (Latitude)">
            <input
              type="number"
              step="0.000001"
              value={value.lat}
              onChange={(e) => update((v) => ({ ...v, lat: Number(e.target.value) }))}
            />
          </Field>
          <Field label="經度 (Longitude)">
            <input
              type="number"
              step="0.000001"
              value={value.lng}
              onChange={(e) => update((v) => ({ ...v, lng: Number(e.target.value) }))}
            />
          </Field>
        </div>
        <Field
          label="Google 地圖嵌入網址"
          hint="到 Google Maps 點分享 → 嵌入網址 → 複製 src 連結（僅接受 google.com/maps/embed 網址）"
        >
          <textarea
            value={value.mapEmbedUrl}
            rows={3}
            onChange={(e) => update((v) => ({ ...v, mapEmbedUrl: e.target.value }))}
          />
        </Field>
      </div>

      {HOURS_KEYS.map(({ key, title }) => (
        <div key={key} className="adm-card">
          <div className="adm-card-head">
            <h3>{title}</h3>
          </div>
          <div className="adm-grid-2">
            <Field label="標籤" hint="顯示在預約區的小標題">
              <input
                type="text"
                value={value.hours[key].label}
                onChange={(e) => patchHours(key, { label: e.target.value })}
              />
            </Field>
            <Field label="日期" hint="如：週五、週六">
              <input
                type="text"
                value={value.hours[key].days}
                onChange={(e) => patchHours(key, { days: e.target.value })}
              />
            </Field>
          </div>
          <Field label="時段" hint="如：18:30 – 01:00">
            <input
              type="text"
              value={value.hours[key].time}
              onChange={(e) => patchHours(key, { time: e.target.value })}
            />
          </Field>
        </div>
      ))}

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>公休</h3>
        </div>
        <Field label="公休日">
          <input
            type="text"
            value={value.hours.closed}
            onChange={(e) => update((v) => ({ ...v, hours: { ...v.hours, closed: e.target.value } }))}
          />
        </Field>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>線上訂位</h3>
          <span className="hint">首頁「Online Reservation」按鈕的連結目標</span>
        </div>
        <Field
          label="預約頁面網址"
          hint="必須以 http:// 或 https:// 開頭，如 https://inline.app/booking/AILAV。留空則隱藏首頁訂位按鈕。"
        >
          <input
            type="url"
            placeholder="https://"
            value={value.reservationUrl ?? ''}
            onChange={(e) =>
              update((v) => ({ ...v, reservationUrl: e.target.value }))
            }
          />
        </Field>
      </div>

      <SaveBar status={status} error={error} />
    </form>
  );
}
