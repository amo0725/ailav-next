import { Suspense } from 'react';
import { getContent } from '@/lib/content';
import EditorSkeleton from '@/components/admin/EditorSkeleton';
import ConceptEditor from './ConceptEditor';

export default function ConceptPage() {
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Concept</p>
        <h1 className="adm-title">品牌理念</h1>
        <p className="adm-subtitle">Concept 區塊的標題、段落與主視覺。</p>
      </div>
      <Suspense fallback={<EditorSkeleton />}>
        <ConceptEditorLoader />
      </Suspense>
    </>
  );
}

async function ConceptEditorLoader() {
  const content = await getContent();
  return <ConceptEditor key={content.version} initial={content.concept} />;
}
