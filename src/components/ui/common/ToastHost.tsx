import { useEffect, useState } from 'react';
import { subscribeNotify } from '@platform/notify';

export function ToastHost() {
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    return subscribeNotify((payload) => {
      setToast(payload);
      window.setTimeout(() => setToast(null), 3500);
    });
  }, []);

  if (!toast) return null;

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 96,
        zIndex: 90,
        background: '#1a1a2e',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: 14,
        maxWidth: 320,
        boxShadow: 'var(--shadow)',
      }}
    >
      <strong>{toast.title}</strong>
      <p style={{ margin: '4px 0 0', fontSize: 13 }}>{toast.message}</p>
    </div>
  );
}
