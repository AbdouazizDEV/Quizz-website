import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@constants/Routes';
import { apiClient } from '@services/api/apiClient';
import { invalidateAuthMeCache } from '@services/auth/authMeRepository';

type Campus = { id: string; code: string; name: string; role: string };
type Edition = {
  edition_key: string;
  timezone: string;
  schedule: {
    daily_open_hours: string[];
    weekday_closes_at: string;
    friday_appeal_until: string;
  };
  periods: { label: string; starts_on: string; ends_on: string; campus: { name: string } | null }[];
  campuses: Campus[];
};
type Registration = {
  status: string;
  document_status: string;
  campus: { id: string; name: string };
} | null;

export function ArenaPage() {
  const navigate = useNavigate();
  const [edition, setEdition] = useState<Edition | null>(null);
  const [registration, setRegistration] = useState<Registration>(null);
  const [campusId, setCampusId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [editionRes, mineRes] = await Promise.all([
          apiClient.get<Edition>('/arena/edition'),
          apiClient.get<{ registration: Registration }>('/arena/me'),
        ]);
        if (cancelled) return;
        setEdition(editionRes.data);
        setRegistration(mineRes.data.registration);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Impossible de charger Arena.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onRegister = async () => {
    if (!campusId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await apiClient.post<{ registration: Registration }>('/arena/register', { campus_id: campusId });
      setRegistration(res.data.registration);
      await invalidateAuthMeCache();
    } catch (err) {
      const data = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : '';
      setError(data || 'Inscription impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="home-page">
      <button type="button" className="premium-status-cta" onClick={() => navigate(Routes.HOME)}>
        Retour à l’accueil
      </button>
      <section className="premium-status-block">
        <h2>Arena 2026</h2>
        {registration ? (
          <>
            <p>Inscrit · campus {registration.campus.name}.</p>
            <p>
              {registration.document_status === 'pending'
                ? 'Justificatif encore requis avant la qualification. L’inscription est déjà enregistrée.'
                : 'Affiliation vérifiée.'}
            </p>
          </>
        ) : (
          <>
            <p>Choisis un seul campus pour cette édition. Le premium Arena s’active à la confirmation.</p>
            <label className="arena-campus-field">
              Campus
              <select value={campusId} onChange={(event) => setCampusId(event.target.value)}>
                <option value="">Choisir</option>
                {(edition?.campuses ?? []).map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                    {campus.role === 'backup' ? ' (secours)' : ''}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="premium-status-cta" disabled={!campusId || busy} onClick={() => void onRegister()}>
              Confirmer l’inscription
            </button>
          </>
        )}
        {error ? <p>{error}</p> : null}
      </section>
      <section className="premium-status-block">
        <h2>Calendrier</h2>
        {edition?.schedule ? (
          <>
            <p>Fuseau {edition.timezone}.</p>
            <p>Ouvertures : {edition.schedule.daily_open_hours.join(', ')}.</p>
            <p>Fermeture du lundi au jeudi : {edition.schedule.weekday_closes_at}.</p>
            <p>Vendredi : classement provisoire le matin, recours jusqu’à {edition.schedule.friday_appeal_until}.</p>
          </>
        ) : null}
        <ul>
          {(edition?.periods ?? []).map((period) => (
            <li key={period.label}>
              {period.label} · {period.starts_on} → {period.ends_on}
              {period.campus ? ` · ${period.campus.name}` : ''}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
