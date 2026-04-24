'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';

const NAV = [
  { href: '/admin', label: 'Dashboard', end: true },
  { href: '/admin/site', label: '網站資訊' },
  { href: '/admin/hero', label: 'Hero' },
  { href: '/admin/concept', label: '理念' },
  { href: '/admin/chefs', label: '主廚' },
  { href: '/admin/manifesto', label: '品牌宣言' },
  { href: '/admin/menu', label: '菜單（時段）' },
  { href: '/admin/menu-cards', label: '菜單卡（照片）' },
  { href: '/admin/reservation', label: '預約 / 資訊' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          AILAV
          <span className="tag">Admin Console</span>
        </div>
        <nav className="adm-nav">
          {NAV.map((item, i) => {
            const active = item.end
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'active' : ''}
              >
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="adm-sidebar-foot">
          <Link href="/" target="_blank" rel="noreferrer">
            ↗ 預覽網站
          </Link>
          <form action={logoutAction}>
            <button type="submit" style={{ width: '100%' }}>
              登出
            </button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
