import { Suspense } from 'react';
import { getContent } from '@/lib/content';
import EditorSkeleton from '@/components/admin/EditorSkeleton';
import MenuEditor from './MenuEditor';

export default function MenuPage() {
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Menu</p>
        <h1 className="adm-title">時段菜單</h1>
        <p className="adm-subtitle">
          首頁顯示的時段概覽卡（主食套餐之夜 / 品味套餐之夜 / 深夜 Wine Bar）。
          想編輯照片風格的完整菜單卡片，請到「菜單卡」頁面。
        </p>
      </div>
      <Suspense fallback={<EditorSkeleton />}>
        <MenuEditorLoader />
      </Suspense>
    </>
  );
}

async function MenuEditorLoader() {
  const content = await getContent();
  return <MenuEditor key={content.version} initial={[...content.menu]} />;
}
