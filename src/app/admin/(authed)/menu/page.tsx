import { getContent } from '@/lib/content';
import MenuEditor from './MenuEditor';

export default async function MenuPage() {
  const content = await getContent();
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
      <MenuEditor initial={[...content.menu]} />
    </>
  );
}
