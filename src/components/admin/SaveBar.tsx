'use client';

type Status = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

type Props = {
  status: Status;
  error?: string;
  disabled?: boolean;
};

const MESSAGES: Record<Status, string> = {
  idle: '尚未變更',
  dirty: '有未儲存的變更',
  saving: '儲存中…',
  saved: '✓ 已儲存',
  error: '儲存失敗',
};

export default function SaveBar({ status, error, disabled }: Props) {
  const cls =
    status === 'dirty' || status === 'saving'
      ? 'dirty'
      : status === 'saved'
      ? 'success'
      : status === 'error'
      ? 'error'
      : '';

  return (
    <div className="adm-save-bar">
      <div className={`status ${cls}`}>{error || MESSAGES[status]}</div>
      <button
        type="submit"
        className="adm-btn"
        disabled={disabled || status === 'saving' || status === 'idle'}
      >
        {status === 'saving' ? '儲存中…' : '儲存變更'}
      </button>
    </div>
  );
}
