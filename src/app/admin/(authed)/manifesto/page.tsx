import { getContent } from '@/lib/content';
import ManifestoEditor from './ManifestoEditor';

export default async function ManifestoPage() {
  const content = await getContent();
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Manifesto</p>
        <h1 className="adm-title">品牌宣言</h1>
        <p className="adm-subtitle">三個詞的三語說明、背景影片與海報圖。</p>
      </div>
      <ManifestoEditor initial={content.manifesto} />
    </>
  );
}
