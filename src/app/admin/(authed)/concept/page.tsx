import { getContent } from '@/lib/content';
import ConceptEditor from './ConceptEditor';

export default async function ConceptPage() {
  const content = await getContent();
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Concept</p>
        <h1 className="adm-title">品牌理念</h1>
        <p className="adm-subtitle">Concept 區塊的標題、段落與主視覺。</p>
      </div>
      <ConceptEditor initial={content.concept} />
    </>
  );
}
