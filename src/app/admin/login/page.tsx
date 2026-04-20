import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const session = await getSession();
  if (session.authenticated) redirect('/admin');
  const initialStage: 'password' | 'totp' =
    session.stage === 'password' ? 'totp' : 'password';
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <h1>AILAV</h1>
        <p className="sub">Admin Console</p>
        <LoginForm initialStage={initialStage} />
      </div>
    </div>
  );
}
