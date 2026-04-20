import { getContent } from '@/lib/content';
import SiteEditor from './SiteEditor';

export default async function SitePage() {
  const content = await getContent();
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Site</p>
        <h1 className="adm-title">網站資訊</h1>
        <p className="adm-subtitle">品牌名稱、標語、SEO 描述。這些文字會出現在頁面 Footer、Meta 標籤與搜尋結果。</p>
      </div>
      <SiteEditor initial={content.site} />
    </>
  );
}
