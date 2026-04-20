import { getContent } from '@/lib/content';
import HeroEditor from './HeroEditor';

export default async function HeroPage() {
  const content = await getContent();
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Hero</p>
        <h1 className="adm-title">Hero 首屏</h1>
        <p className="adm-subtitle">首屏主圖（全螢幕背景）與五張 scatter 小圖（桌機才顯示）。</p>
      </div>
      <HeroEditor initial={content.hero} />
    </>
  );
}
