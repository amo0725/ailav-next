import { getContent } from '@/lib/content';
import ChefsEditor from './ChefsEditor';

export default async function ChefsPage() {
  const content = await getContent();
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Chefs</p>
        <h1 className="adm-title">主廚</h1>
        <p className="adm-subtitle">
          管理主廚列表：每位主廚可設定多張圖片（hover 時自動切換）、生平段落與獎項。
        </p>
      </div>
      <ChefsEditor initial={[...content.chefs]} />
    </>
  );
}
