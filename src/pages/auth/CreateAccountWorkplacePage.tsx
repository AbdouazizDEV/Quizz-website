import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { useOnboardingRegisterStore } from '@stores/onboardingRegisterStore';
import { Icon } from '@components/ui/Icon';

const OPTIONS = [
  { id: 'school', label: 'École', icon: 'file-text', color: '#FFB703' },
  { id: 'higher-education', label: 'Enseignement supérieur', icon: 'check-square', color: '#FB8500' },
  { id: 'teams', label: 'Équipes', icon: 'users', color: '#00B894' },
  { id: 'company', label: 'Entreprise', icon: 'briefcase', color: '#FF6B6B' },
];

export function CreateAccountWorkplacePage() {
  const navigate = useNavigate();
  const setWorkplaceId = useOnboardingRegisterStore((s) => s.setWorkplaceId);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="auth-page">
      <div className="auth-inner">
        <Link to={Routes.CREATE_ACCOUNT_TYPE}><Icon name="chevron-left" /></Link>
        <div style={{ height: 8, background: '#F0F0F0', borderRadius: 99, margin: '20px 0' }}>
          <div style={{ width: '66%', height: '100%', background: '#F5A623', borderRadius: 99 }} />
        </div>
        <h1>Où joues-tu ?</h1>
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
                setWorkplaceId(opt.id);
                navigate(Routes.CREATE_ACCOUNT_PROFILE);
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
