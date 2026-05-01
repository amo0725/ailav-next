'use client';

import type { Site } from '@/lib/content/types';
import { updateSite } from '@/app/actions/content';
import Field from '@/components/admin/Field';
import SaveBar from '@/components/admin/SaveBar';
import { useEditorForm } from '@/components/admin/useEditorForm';
import { useBeforeUnload } from '@/lib/hooks/useBeforeUnload';

export default function SiteEditor({ initial }: { initial: Site }) {
  const { value, update, status, error, onSubmit } = useEditorForm<Site>(
    initial,
    async (next) => updateSite(next)
  );
  useBeforeUnload(status === 'dirty');

  return (
    <form onSubmit={onSubmit}>
      <div className="adm-card">
        <Field label="品牌名稱" htmlFor="name" hint="出現在標題、Header、Footer">
          <input
            id="name"
            type="text"
            value={value.name}
            onChange={(e) => update((v) => ({ ...v, name: e.target.value }))}
          />
        </Field>
        <Field label="主標語" htmlFor="tagline" hint="如：Aile · Il a · Voyage">
          <input
            id="tagline"
            type="text"
            value={value.tagline}
            onChange={(e) => update((v) => ({ ...v, tagline: e.target.value }))}
          />
        </Field>
        <Field label="副標語" htmlFor="subtitle">
          <input
            id="subtitle"
            type="text"
            value={value.subtitle}
            onChange={(e) => update((v) => ({ ...v, subtitle: e.target.value }))}
          />
        </Field>
        <Field label="SEO 描述" htmlFor="desc" hint="搜尋引擎與社群分享時顯示的摘要">
          <textarea
            id="desc"
            value={value.description}
            onChange={(e) => update((v) => ({ ...v, description: e.target.value }))}
            rows={3}
          />
        </Field>
        <Field
          label="Instagram 網址"
          htmlFor="ig"
          hint="留空則公開頁不顯示 IG 圖示。需 http:// 或 https:// 開頭的完整網址。"
        >
          <input
            id="ig"
            type="url"
            inputMode="url"
            placeholder="https://www.instagram.com/your_handle/"
            value={value.social.instagram}
            onChange={(e) =>
              update((v) => ({ ...v, social: { ...v.social, instagram: e.target.value } }))
            }
          />
        </Field>
        <Field
          label="Facebook 網址"
          htmlFor="fb"
          hint="留空則公開頁不顯示 FB 圖示。需 http:// 或 https:// 開頭的完整網址。"
        >
          <input
            id="fb"
            type="url"
            inputMode="url"
            placeholder="https://www.facebook.com/yourpage"
            value={value.social.facebook}
            onChange={(e) =>
              update((v) => ({ ...v, social: { ...v.social, facebook: e.target.value } }))
            }
          />
        </Field>
      </div>
      <SaveBar status={status} error={error} />
    </form>
  );
}
