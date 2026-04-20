'use client';

import { useActionState, useState } from 'react';
import {
  loginPasswordAction,
  loginTotpAction,
  type LoginState,
} from '@/app/actions/auth';

type Props = { initialStage: 'password' | 'totp' };
type Stage = 'password' | 'totp';

export default function LoginForm({ initialStage }: Props) {
  const [pwState, pwAction, pwPending] = useActionState<
    LoginState | undefined,
    FormData
  >(loginPasswordAction, undefined);

  const [totpState, totpAction, totpPending] = useActionState<
    LoginState | undefined,
    FormData
  >(loginTotpAction, undefined);

  const [stage, setStage] = useState<Stage>(initialStage);
  const [trackedPwStage, setTrackedPwStage] = useState<Stage | undefined>();
  const [trackedTotpStage, setTrackedTotpStage] = useState<Stage | undefined>();

  // Adjust state during render when server action state changes
  // (React-endorsed alternative to useEffect + setState).
  // The stage-specific form unmounts/mounts on transition, so `autoFocus`
  // on each input is enough to put focus in the right place.
  if (pwState?.stage !== trackedPwStage) {
    setTrackedPwStage(pwState?.stage);
    if (pwState?.stage === 'totp') setStage('totp');
  }
  if (totpState?.stage !== trackedTotpStage) {
    setTrackedTotpStage(totpState?.stage);
    if (totpState?.stage === 'password') setStage('password');
  }

  if (stage === 'password') {
    return (
      <form action={pwAction}>
        {pwState?.error && (
          <div className="adm-alert error" role="alert" aria-live="polite">
            {pwState.error}
          </div>
        )}
        <div className="adm-field">
          <label htmlFor="password">密碼</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
          />
          <p className="hint">第一步：輸入管理員密碼</p>
        </div>
        <button
          type="submit"
          className="adm-btn"
          disabled={pwPending}
          style={{ width: '100%' }}
        >
          {pwPending ? '驗證中…' : '下一步'}
        </button>
      </form>
    );
  }

  return (
    <form action={totpAction}>
      {totpState?.error && (
        <div className="adm-alert error" role="alert" aria-live="polite">
          {totpState.error}
        </div>
      )}
      <div className="adm-field">
        <label htmlFor="code">驗證碼</label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          autoComplete="one-time-code"
          required
          autoFocus
          placeholder="000000"
          style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: '1.2rem' }}
        />
        <p className="hint">第二步：輸入 Authenticator App 的 6 位數驗證碼</p>
      </div>
      <button
        type="submit"
        className="adm-btn"
        disabled={totpPending}
        style={{ width: '100%' }}
      >
        {totpPending ? '驗證中…' : '登入'}
      </button>
      <button
        type="button"
        className="adm-btn subtle small"
        style={{ width: '100%', marginTop: 10 }}
        onClick={() => setStage('password')}
      >
        ← 返回
      </button>
    </form>
  );
}
