import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import AdminShell from '@/components/admin/AdminShell';

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.authenticated) redirect('/admin/login');
  return <AdminShell>{children}</AdminShell>;
}
