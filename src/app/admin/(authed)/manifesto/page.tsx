import { Suspense } from 'react';
import { getContent } from '@/lib/content';
import EditorSkeleton from '@/components/admin/EditorSkeleton';
import ManifestoEditor from './ManifestoEditor';

export default function ManifestoPage() {
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Manifesto</p>
        <h1 className="adm-title">品牌宣言</h1>
        <p className="adm-subtitle">三個詞的三語說明、背景影片與海報圖。</p>
      </div>
      <Suspense fallback={<EditorSkeleton />}>
        <ManifestoEditorLoader />
      </Suspense>
    </>
  );
}

async function ManifestoEditorLoader() {
  const content = await getContent();
  return <ManifestoEditor key={content.version} initial={content.manifesto} />;
}
