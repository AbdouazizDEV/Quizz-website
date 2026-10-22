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
type Visibility = {
  digital_public: string[];
  restricted: string[];
  recipients: string;
  partner_lead: string;
};
type PublicParticipant = {
  user_id: string;
  pseudonym: string;
  campus: { name: string };
  score: number;
  rank: number;
};
type MissionBoard = {
  timezone: string;
  phase: string;
  missions: Array<{ universe: string; label: string; opens_at: string; closes_at: string; state: string; accepts_answers: boolean; reason: string }>;
  tie_break: { window_open: boolean; reopens_missions: boolean; can_enter: boolean };
};

const PHASE_LABEL: Record<string, string> = {
  idle: 'Hors semaine de compétition',
  rest: 'Pas de mission aujourd’hui',
  upcoming: 'Les missions n’ont pas encore ouvert',
  in_progress: 'Missions en cours',
  closed: 'Missions clôturées',
  friday_appeal: 'Vendredi : recours ouvert, aucune nouvelle mission',
  friday_closed: 'Vendredi : recours clos, missions fermées',
};
const STATE_LABEL: Record<string, string> = {
  upcoming: 'À venir',
  open: 'Ouverte',
  closed: 'Clôturée',
};

export function ArenaPage() {
  const navigate = useNavigate();
  const [edition, setEdition] = useState<Edition | null>(null);
  const [registration, setRegistration] = useState<Registration>(null);
  const [visibility, setVisibility] = useState<Visibility | null>(null);
  const [partnerConsentAt, setPartnerConsentAt] = useState<string | null>(null);
  const [participants, setParticipants] = useState<PublicParticipant[]>([]);
  const [missions, setMissions] = useState<MissionBoard | null>(null);
  const [consentBusy, setConsentBusy] = useState(false);
  const [campusId, setCampusId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [editionRes, mineRes, boardRes, missionRes] = await Promise.all([
          apiClient.get<Edition>('/arena/edition'),
          apiClient.get<{ registration: Registration; visibility?: Visibility; partner_consent_at?: string | null }>('/arena/me'),
          apiClient.get<{ participants: PublicParticipant[] }>('/arena/participants'),
          apiClient.get<MissionBoard>('/arena/missions').catch(() => null),
        ]);
        if (cancelled) return;
        setEdition(editionRes.data);
        setRegistration(mineRes.data.registration);
        setVisibility(mineRes.data.visibility ?? null);
        setPartnerConsentAt(mineRes.data.partner_consent_at ?? null);
        setParticipants(boardRes.data.participants ?? []);
        setMissions(missionRes?.data ?? null);
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

  const onPartnerConsent = async () => {
    setConsentBusy(true);
    setError(null);
    try {
      const res = await apiClient.post<{ partner_consent_at: string }>('/arena/me/partner-consent', { accepted: true });
      setPartnerConsentAt(res.data.partner_consent_at);
    } catch (err) {
      const data = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : '';
      setError(data || 'Le consentement partenaire n’a pas été enregistré.');
    } finally {
      setConsentBusy(false);
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
            {partnerConsentAt ? (
              <p>Consentement partenaire enregistré. Il est distinct de l’inscription.</p>
            ) : (
              <button type="button" className="arena-consent-cta" disabled={consentBusy} onClick={() => void onPartnerConsent()}>
                J’accepte d’être contacté par un partenaire
              </button>
            )}
          </>
        ) : (
          <>
            <p>Choisis un seul campus pour cette édition. Le premium Arena s’active à la confirmation.</p>
            {visibility ? (
              <p className="arena-visibility-note">
                Le classement digital affiche {visibility.digital_public.join(', ')}. Restent privés : {visibility.restricted.join(', ')}. {visibility.recipients}
              </p>
            ) : null}
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
        <h2>Classement digital</h2>
        <p>Pseudonyme, campus, score et rang. Ni téléphone, ni e-mail, ni justificatif.</p>
        {participants.length === 0 ? <p>Aucun participant pour le moment.</p> : null}
        <ol className="arena-public-board">
          {participants.map((row) => (
            <li key={row.user_id}>
              <b>#{row.rank}</b> {row.pseudonym}
              <span>{row.campus.name}</span>
              <span>{row.score} pts</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="premium-status-block">
        <h2>Missions du jour</h2>
        {missions ? (
          <>
            <p>{PHASE_LABEL[missions.phase] ?? missions.phase}. Heure de {missions.timezone}.</p>
            {missions.tie_break.window_open ? (
              <p>
                {missions.tie_break.can_enter
                  ? 'Tu es concerné par le départage. Les missions générales restent fermées.'
                  : 'Le départage est réservé aux ex æquo. Les missions générales restent fermées.'}
              </p>
            ) : null}
            <ul>
              {missions.missions.map((mission) => (
                <li key={mission.universe}>
                  {mission.opens_at} · {mission.label} · {STATE_LABEL[mission.state] ?? mission.state}
                  {mission.accepts_answers ? '' : ` · ${mission.reason}`}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Les états de mission seront affichés dès que le serveur les publie.</p>
        )}
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
