import Link from 'next/link';

const SECTIONS = [
  { href: '/admin/site', title: '網站資訊', hint: '站名、標語、SEO 描述' },
  { href: '/admin/hero', title: 'Hero', hint: '首屏主圖與散圖' },
  { href: '/admin/concept', title: '理念', hint: '品牌故事段落與圖片' },
  { href: '/admin/chefs', title: '主廚', hint: '主廚列表、多張圖片、生平、獎項' },
  { href: '/admin/manifesto', title: '品牌宣言', hint: '三個詞、影片、海報' },
  { href: '/admin/menu', title: '菜單（時段）', hint: '首頁顯示的時段概覽卡' },
  { href: '/admin/menu-cards', title: '菜單卡（照片）', hint: '完整菜單卡片，呈現於 /menu' },
  { href: '/admin/reservation', title: '預約 / 資訊', hint: '地址、營業時間、地圖' },
];

export default function Dashboard() {
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Admin</p>
        <h1 className="adm-title">Dashboard</h1>
        <p className="adm-subtitle">
          選擇要編輯的區塊。所有變更會即時套用到網站上。
        </p>
      </div>
      <div className="adm-dash">
        {SECTIONS.map((s, i) => (
          <Link key={s.href} href={s.href}>
            <span className="idx">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p>{s.hint}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
