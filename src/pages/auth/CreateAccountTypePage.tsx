import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { useOnboardingRegisterStore } from '@stores/onboardingRegisterStore';
import { Icon } from '@components/ui/Icon';

const OPTIONS = [
  { id: 'personal', label: 'Personnel', icon: 'user', color: '#FFB703' },
  { id: 'teacher', label: 'Professeur', icon: 'users', color: '#FB8500' },
  { id: 'student', label: 'Étudiant', icon: 'user-check', color: '#00B894' },
  { id: 'professional', label: 'Professionnel', icon: 'briefcase', color: '#FF6B6B' },
];

export function CreateAccountTypePage() {
  const navigate = useNavigate();
  const setAccountTypeId = useOnboardingRegisterStore((s) => s.setAccountTypeId);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="auth-page">
      <div className="auth-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to={Routes.WALKTHROUGH}><Icon name="chevron-left" /></Link>
          <Link to={Routes.WALKTHROUGH} className="muted">Passer</Link>
        </div>
        <div style={{ height: 8, background: '#F0F0F0', borderRadius: 99, margin: '20px 0' }}>
          <div style={{ width: '33%', height: '100%', background: '#F5A623', borderRadius: 99 }} />
        </div>
        <h1>Quel type de compte ?</h1>
        <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                border: selected === opt.id ? '2px solid #E8431A' : '1px solid var(--border)',
                background: '#fff',
              }}
              onClick={() => {
                setSelected(opt.id);
                setAccountTypeId(opt.id);
                navigate(Routes.CREATE_ACCOUNT_WORKPLACE);
              }}
            >
              <span style={{ width: 44, height: 44, borderRadius: 14, background: opt.color, display: 'grid', placeItems: 'center', color: '#fff' }}>
                <Icon name={opt.icon} />
              </span>
              <strong>{opt.label}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
