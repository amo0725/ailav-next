import { Suspense } from 'react';
import { getContent } from '@/lib/content';
import EditorSkeleton from '@/components/admin/EditorSkeleton';
import ChefsEditor from './ChefsEditor';

export default function ChefsPage() {
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Chefs</p>
        <h1 className="adm-title">主廚</h1>
        <p className="adm-subtitle">
          管理主廚列表：每位主廚可設定多張圖片（hover 時自動切換）、生平段落與獎項。
        </p>
      </div>
      <Suspense fallback={<EditorSkeleton />}>
        <ChefsEditorLoader />
      </Suspense>
    </>
  );
}

async function ChefsEditorLoader() {
  const content = await getContent();
  return <ChefsEditor key={content.version} initial={[...content.chefs]} />;
}
