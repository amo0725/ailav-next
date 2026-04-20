import { getContent } from '@/lib/content';
import MenuEditor from './MenuEditor';

export default async function MenuPage() {
  const content = await getContent();
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Menu</p>
        <h1 className="adm-title">菜單</h1>
        <p className="adm-subtitle">各時段套餐項目。備註可用換行寫多行。</p>
      </div>
      <MenuEditor initial={[...content.menu]} />
    </>
  );
}
