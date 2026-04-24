import { getContent, SEED_CONTENT } from '@/lib/content';
import MenuCardsEditor from './MenuCardsEditor';

export default async function MenuCardsPage() {
  const content = await getContent();
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Menu Cards</p>
        <h1 className="adm-title">菜單卡（照片風格）</h1>
        <p className="adm-subtitle">
          赤陶 / 橄欖印刷風格的完整菜單卡片，呈現於 <code>/menu</code>。
          每張可獨立設定主題色、是否分組（tasting）或單點（à la carte），並可附上盤式照片。
        </p>
      </div>
      <MenuCardsEditor
        initial={[...content.menuCards]}
        seedTemplate={SEED_CONTENT.menuCards}
      />
    </>
  );
}
