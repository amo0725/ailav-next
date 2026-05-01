import { Suspense } from 'react';
import { getSession } from '@/lib/auth/session';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <h1>AILAV</h1>
        <p className="sub">Admin Console</p>
        <Suspense fallback={null}>
          <LoginFormLoader />
        </Suspense>
      </div>
    </div>
  );
}

async function LoginFormLoader() {
  const session = await getSession();
  const initialStage: 'password' | 'totp' =
    session.stage === 'password' ? 'totp' : 'password';
  return <LoginForm initialStage={initialStage} />;
}
