import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { Routes } from '@constants/Routes';
import { useOnboardingRegisterStore } from '@stores/onboardingRegisterStore';
import { Icon } from '@components/ui/Icon';

export function CreateAccountProfilePage() {
  const navigate = useNavigate();
  const setProfile = useOnboardingRegisterStore((s) => s.setProfile);
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [countryCca2, setCountryCca2] = useState('SN');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onContinue = () => {
    if (!fullName.trim() || !birthDate || !phone.trim()) {
      setError('Complète ton nom, ta date de naissance et ton téléphone.');
      return;
    }
    setProfile({
      fullName: fullName.trim(),
      birthDateIso: birthDate,
      countryCca2,
      phoneE164: phone.trim(),
    });
    navigate(Routes.REGISTER);
  };

  return (
    <div className="auth-page">
      <div className="auth-inner">
        <Link to={Routes.CREATE_ACCOUNT_WORKPLACE}><Icon name="chevron-left" /></Link>
        <div style={{ height: 8, background: '#F0F0F0', borderRadius: 99, margin: '20px 0' }}>
          <div style={{ width: '85%', height: '100%', background: '#F5A623', borderRadius: 99 }} />
        </div>
        <h1>Ton profil</h1>
        <div style={{ display: 'grid', gap: 24, marginTop: 24 }}>
          <label className="field">
            <span>Nom complet</span>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={AUTH_FORM_PLACEHOLDERS.fullName} />
          </label>
          <label className="field">
            <span>Date de naissance</span>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </label>
          <label className="field">
            <span>Pays</span>
            <select value={countryCca2} onChange={(e) => setCountryCca2(e.target.value)}>
              <option value="SN">Sénégal (+221)</option>
              <option value="CI">Côte d’Ivoire (+225)</option>
              <option value="FR">France (+33)</option>
              <option value="ML">Mali (+223)</option>
            </select>
          </label>
          <label className="field">
            <span>Téléphone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={AUTH_FORM_PLACEHOLDERS.phone} />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="button" className="btn btn-primary" onClick={onContinue}>Continuer</button>
        </div>
      </div>
    </div>
  );
}
